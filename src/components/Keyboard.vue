<script>
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';

export default {
    name: 'SimpleKeyboard',
    props: {
        commonKeyboardOptions: {
            theme: 'simple-keyboard hg-theme-default hg-layout-default',
            physicalKeyboardHighlight: true,
            syncInstanceInputs: true,
            mergeDisplay: true,
        }
    },
    data: () => ({
        keyboard: null
    }),
    mounted() {
        this.keyboard = new Keyboard('simple-keyboard-main', {
            ...this.commonKeyboardOptions,
            onChange: this.onChange,
            onKeyPress: this.onKeyPress,
            layout: {
                'default': [
                '{ESCAPE} {F1} {F2} {F3} {F4} {F5} {F6} {F7} {F8} {F9} {F10} {F11} {F12}',
                '{OEM_3} 1 2 3 4 5 6 7 8 9 0 {OEM_MINUS} {OEM_PLUS} {BACK}',
                '{TAB} Q W E R T Y U I O P {OEM_4} {OEM_6} {OEM_5}',
                '{CAPSLOCK} A S D F G H J K L {OEM_1} {OEM_7} {RETURN}',
                '{LSHIFT} Z X C V B N M {OEM_COMMA} {OEM_PERIOD} {OEM_2} {RSHIFT}',
                '{LCONTROL} {LALT} {} {SPACE} {RALT} {} {APPS} {RCONTROL}'
                ],
  
            },
            display: {
                '{ESCAPE}':'esc',
                '{F1}':'f1',
                '{F2}':'f2',
                '{F3}':'f3',
                '{F4}':'f4',
                '{F5}':'f5',
                '{F6}':'f6',
                '{F7}':'f7',
                '{F8}':'f8',
                '{F9}':'f9',
                '{F10}':'f10',
                '{F11}':'f11',
                '{F12}':'f12',
                '{OEM_3}':'`',
                '{OEM_MINUS}': '-',
                '{OEM_PLUS}': '=',
                '{BACK}': 'backspace',
                '{TAB}': 'tab',
                '{OEM_4}': '[',
                '{OEM_6}': ']',
                '{OEM_5}': '\\',
                '{CAPSLOCK}': 'caps',
                '{OEM_1}': ';',
                '{OEM_7}': '\'',
                '{RETURN}': 'enter',
                '{LSHIFT}': 'L shift',
                '{OEM_COMMA}': ',',
                '{OEM_PERIOD}': '.',
                '{OEM_2}': '/',
                '{RSHIFT}': 'R shift',
                '{LCONTROL}': 'L ctrl',
                '{LALT}': 'L alt',
                '{SPACE}': 'spacebar',
                '{RALT}': 'R alt',
                '{APPS}': 'menu',
                '{RCONTROL}': 'R ctrl',
                '{}': ' ',
            }
        });
        this.keyboardControlPad = new Keyboard('.simple-keyboard-control', {
            ...this.commonKeyboardOptions,
            onChange: this.onChange,
            onKeyPress: this.onKeyPress,
            layout: {
                default: [
                '{SNAPSHOT} {SCROLL} {PAUSE}',
                '{INSERT} {HOME} {PRIOR}',
                '{DELETE} {END} {NEXT}'
                ]
            },
            display: {
                '{SNAPSHOT}': 'print',
                '{SCROLL}': 'scrlk',
                '{PAUSE}': 'pause',
                '{INSERT}': 'ins',
                '{HOME}': 'home',
                '{PRIOR}': 'pgup',
                '{DELETE}': 'del',
                '{END}': 'end',
                '{NEXT}': 'pgdn',
            }
        });

        this.keyboardArrows = new Keyboard('.simple-keyboard-arrows', {
            ...this.commonKeyboardOptions,
            onChange: this.onChange,
            onKeyPress: this.onKeyPress,
            layout: {
                default: ['{UP}', '{LEFT} {DOWN} {RIGHT}']
            },
            display: {
                '{UP}': '↑',
                '{LEFT}': '←',
                '{DOWN}': '↓',
                '{RIGHT}': '→',
            }
        });

        this.keyboardNumPad = new Keyboard('.simple-keyboard-numpad', {
            ...this.commonKeyboardOptions,
            onChange: this.onChange,
            onKeyPress: this.onKeyPress,
            layout: {
                default: [
                '{NUMLOCK} {DIVIDE} {MULTIPLY}',
                '{NUMPAD7} {NUMPAD8} {NUMPAD9}',
                '{NUMPAD4} {NUMPAD5} {NUMPAD6}',
                '{NUMPAD1} {NUMPAD2} {NUMPAD3}',
                '{NUMPAD0} {DECIMAL}'
                ]
            },
            display: {
                '{NUMLOCK}': 'lock',
                '{DIVIDE}': '/',
                '{MULTIPLY}': '*',
                '{NUMPAD7}': '7',
                '{NUMPAD8}': '8',
                '{NUMPAD9}': '9',
                '{NUMPAD4}': '4',
                '{NUMPAD5}': '5',
                '{NUMPAD6}': '6',
                '{NUMPAD1}': '1',
                '{NUMPAD2}': '2',
                '{NUMPAD3}': '3',
                '{NUMPAD0}': '0',
                '{DECIMAL}': '.',
            }
        });

        this.keyboardNumPadEnd = new Keyboard('.simple-keyboard-numpadEnd', {
            ...this.commonKeyboardOptions,
            onChange: this.onChange,
            onKeyPress: this.onKeyPress,
            layout: {
                default: ['{SUBTRACT}', '{ADD}', '{RETURN}']
            },
            display: {
                '{SUBTRACT}':'-',
                '{ADD}':'+',
                '{RETURN}':'enter',
            }
        });

    },
    methods: {
        onChange(input) {
            this.$emit('onChange', input);
        },
        onKeyPress(button) {
            this.$emit('onKeyPress', button);
        }
    },
    watch: {
        input(input) {
            this.keyboard.setInput(input);
        }
    }
};
</script>

<template>
    <div class='container keyboard-container'>
        <div class='simple-keyboard-main'></div>
        <div class='control-arrows'>
            <div class='simple-keyboard-control'></div>
            <div class='simple-keyboard-arrows'></div>
        </div>
        <div class='num-pad-container'>
            <div class='keyboard-logo'>
                <img draggable='false' src='/logo.svg'>
                SoundByte
            </div>
            <div class='num-pad'>
                <div class='simple-keyboard-numpad'></div>
                <div class='simple-keyboard-numpadEnd'></div>
            </div>
        </div>
    </div>
</template>


<style>
    .keyboard-logo {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        color: #f6f5f4;
        font-size: 35px;
        line-height: 35px;
        letter-spacing: -0.1rem;
        font-family: 'Yellowtail', cursive;
        user-select: none;
    }

    .keyboard-logo img {
        aspect-ratio: square;
        height: 2.5rem;
    }

    .keyboard-container {
        flex-direction: row !important;
        justify-content: space-between;
        width: 100%;
    }

    .keyboard-container *{
        margin: 0;
        padding: 0;
    }

    .control-arrows {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-flow: column;
    }

    .num-pad-container {
        align-items: flex-end;
        display: flex;
        flex-direction: column;
    }

    .num-pad {
        display: flex;
        align-items: flex-end;
        gap: 5px;
        margin-top: 1rem;
        /* justify-content: space-between; */
    }

    .simple-keyboard-main {
        width: fit-content;
        background: none;
    }

    .simple-keyboard-main .hg-row:first-child {
        margin-bottom: 1rem;
    }

    .hg-button {
        width: 40px;
        min-width: 40px;
        max-width: 40px;
        flex-grow: 0;
        flex-shrink: 0;
        background-color: #121212 !important;
        color: #f6f5f4;
        font-family: 'Fira Sans', sans-serif;
    }

    .hg-button:hover:not(.hg-activeButton) {
        background-color: rgba(253, 253, 150, 0.5) !important;
    }

    .hg-activeButton{
        background-color: #fdfd96ff !important;
        color: #121212 !important;
    }

    .hg-button-BACK {
        width: calc(2.0 * 40px);
        max-width: calc(2.0 * 40px);
    }

    .hg-button-TAB, .hg-button[data-skbtnuid='default-r2b13'] {
        width: calc(1.5 * 40px);
        max-width: calc(1.5 * 40px);
    }

    .hg-button-CAPSLOCK {
        width: calc(1.75 * 40px);
        max-width: calc(1.75 * 40px);
    }

    .hg-button-RETURN {
        width: auto;
        max-width: none;
    }

    .hg-button-RSHIFT {
        width: auto;
        max-width: none;
    }

    .hg-button-LSHIFT {
        width: calc(2.25 * 40px);
        max-width: calc(2.25 * 40px);
    }
    .simple-keyboard-main .hg-row:first-child .hg-button {
        width: auto;
        max-width: none;
    }
    .simple-keyboard-main .hg-row:last-child .hg-button {
        width: calc(1.25 * 40px);
        max-width: calc(1.25 * 40px);
    }

    .hg-button-SPACE {
        width: auto !important;
        max-width: none !important;
    }

    .simple-keyboard-arrows {
        align-self: flex-end;
        background: none;
    }

    .simple-keyboard-arrows .hg-row:first-child .hg-button {
        margin: 0 auto;
    }

    .simple-keyboard-control {
        width: fit-content;
        background: none;
    }

    .simple-keyboard-control .hg-row:first-child {
        margin-bottom: 1rem;
    }

    .simple-keyboard-numpad {
        /* align-self: flex-end; */
        width: fit-content;
        background: none;
    }
    .simple-keyboard-numpad .hg-row:last-child .hg-button:first-child {
        width: auto;
        max-width: none;
    }

    .simple-keyboard-numpadEnd{
        width: fit-content;
        background: none;
    }

    .simple-keyboard-numpadEnd .hg-button-ADD {
        height: 85px;
    }

    .simple-keyboard-numpadEnd .hg-button.hg-button-RETURN {
        height: 85px;
        width: 40px;
    }
</style>