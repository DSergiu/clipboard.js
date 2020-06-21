import Clipboard from '../src/clipboard';
import ClipboardAction from '../src/clipboard-action';

describe('Clipboard', () => {
    before(() => {
        global.button = document.createElement('button');
        global.button.setAttribute('class', 'btn');
        global.button.setAttribute('data-clipboard-text', 'foo');
        document.body.appendChild(global.button);

        global.span = document.createElement('span');
        global.span.innerHTML = 'bar';

        global.button.appendChild(span);

        global.event = {
            target: global.button,
            currentTarget: global.button
        };
    });

    after(() => {
        document.body.innerHTML = '';
    });

    describe('#resolveOptions', () => {
        before(() => {
            global.fn = () => {};
            global.fnAsync = () => Promise.resolve();
        });

        it('should set action as a sync function', () => {
            let clipboard = new Clipboard('.btn', {
                action: global.fn
            });

            assert.equal(global.fn, clipboard.action);
        });

        it('should set action as an async function', () => {
            let clipboard = new Clipboard('.btn', {
                action: global.fnAsync
            });

            assert.equal(global.fnAsync, clipboard.action);
        });

        it('should set target as a sync function', () => {
            let clipboard = new Clipboard('.btn', {
                target: global.fn
            });

            assert.equal(global.fn, clipboard.target);
        });

        it('should set target as an async function', () => {
            let clipboard = new Clipboard('.btn', {
                target: global.fnAsync
            });

            assert.equal(global.fnAsync, clipboard.target);
        });

        it('should set text as a sync function', () => {
            let clipboard = new Clipboard('.btn', {
                text: global.fn
            });

            assert.equal(global.fn, clipboard.text);
        });

        it('should set text as an async function', () => {
            let clipboard = new Clipboard('.btn', {
                text: global.fnAsync
            });

            assert.equal(global.fnAsync, clipboard.text);
        });

        it('should set container as an object', () => {
            let clipboard = new Clipboard('.btn', {
                container: document.body
            });

            assert.equal(document.body, clipboard.container);
        });

        it('should set container as body by default', () => {
            let clipboard = new Clipboard('.btn');

            assert.equal(document.body, clipboard.container);
        });
    });

    describe('#listenClick', () => {
        it('should add a click event listener to the passed selector', () => {
            let clipboard = new Clipboard('.btn');
            assert.isObject(clipboard.listener);
        });
    });

    describe('#onClick', async () => {
        it('should create a new instance of ClipboardAction', async () => {
            let clipboard = new Clipboard('.btn');

            await clipboard.onClick(global.event);
            assert.instanceOf(clipboard.clipboardAction, ClipboardAction);
        });

        it('should use an event\'s currentTarget when not equal to target', async () => {
            let clipboard = new Clipboard('.btn');
            let bubbledEvent = { target: global.span, currentTarget: global.button };

            await clipboard.onClick(bubbledEvent);
            assert.instanceOf(clipboard.clipboardAction, ClipboardAction);
        });

        it('should throw an exception when target is invalid', async () => {
            try {
                const clipboard = new Clipboard('.btn', {
                    target() {
                        return null;
                    }
                });

                await clipboard.onClick(global.event);
            }
            catch(e) {
                assert.equal(e.message, 'Invalid "target" value, use a valid Element');
            }
        });
    });

    describe('#static isSupported', () => {
        it('should return the support of the given action', () => {
            assert.equal(Clipboard.isSupported('copy'), true);
            assert.equal(Clipboard.isSupported('cut'), true);
        });

        it('should return the support of the cut and copy actions', () => {
            assert.equal(Clipboard.isSupported(), true);
        });
    });

    describe('#destroy', () => {
        it('should destroy an existing instance of ClipboardAction', () => {
            let clipboard = new Clipboard('.btn');

            clipboard.onClick(global.event);
            clipboard.destroy();

            assert.equal(clipboard.clipboardAction, null);
        });
    });
});
