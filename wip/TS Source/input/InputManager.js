/// <reference path="../_definitions.ts" />
/**
* Phaser - InputManager
*
* A game specific Input manager that looks after the mouse, keyboard and touch objects.
* This is updated by the core game loop.
*/
var Phaser;
(function (Phaser) {
    var InputManager = (function () {
        function InputManager(game) {
            /**
            * How often should the input pointers be checked for updates?
            * A value of 0 means every single frame (60fps), a value of 1 means every other frame (30fps) and so on.
            * @type {number}
            */
            this.pollRate = 0;
            this._pollCounter = 0;
            /**
            * A vector object representing the previous position of the Pointer.
            * @property vector
            * @type {Vec2}
            **/
            this._oldPosition = null;
            /**
            * X coordinate of the most recent Pointer event
            * @type {Number}
            * @private
            */
            this._x = 0;
            /**
            * X coordinate of the most recent Pointer event
            * @type {Number}
            * @private
            */
            this._y = 0;
            /**
            * You can disable all Input by setting Input.disabled = true. While set all new input related events will be ignored.
            * If you need to disable just one type of input, for example mouse, use Input.mouse.disabled = true instead
            * @type {bool}
            */
            this.disabled = false;
            /**
            * Controls the expected behaviour when using a mouse and touch together on a multi-input device
            */
            this.multiInputOverride = InputManager.MOUSE_TOUCH_COMBINE;
            /**
            * Phaser.Gestures handler
            * @type {Gestures}
            */
            //public gestures: Gestures;
            /**
            * A vector object representing the current position of the Pointer.
            * @property vector
            * @type {Vec2}
            **/
            this.position = null;
            /**
            * A vector object representing the speed of the Pointer. Only really useful in single Pointer games,
            * otherwise see the Pointer objects directly.
            * @property vector
            * @type {Vec2}
            **/
            this.speed = null;
            /**
            * A Circle object centered on the x/y screen coordinates of the Input.
            * Default size of 44px (Apples recommended "finger tip" size) but can be changed to anything
            * @property circle
            * @type {Circle}
            **/
            this.circle = null;
            /**
            * The scale by which all input coordinates are multiplied, calculated by the StageScaleMode.
            * In an un-scaled game the values will be x: 1 and y: 1.
            * @type {Vec2}
            */
            this.scale = null;
            /**
            * The maximum number of Pointers allowed to be active at any one time.
            * For lots of games it's useful to set this to 1
            * @type {Number}
            */
            this.maxPointers = 10;
            /**
            * The current number of active Pointers.
            * @type {Number}
            */
            this.currentPointers = 0;
            /**
            * The number of milliseconds that the Pointer has to be pressed down and then released to be considered a tap or click
            * @property tapRate
            * @type {Number}
            **/
            this.tapRate = 200;
            /**
            * The number of milliseconds between taps of the same Pointer for it to be considered a double tap / click
            * @property doubleTapRate
            * @type {Number}
            **/
            this.doubleTapRate = 300;
            /**
            * The number of milliseconds that the Pointer has to be pressed down for it to fire a onHold event
            * @property holdRate
            * @type {Number}
            **/
            this.holdRate = 2000;
            /**
            * The number of milliseconds below which the Pointer is considered justPressed
            * @property justPressedRate
            * @type {Number}
            **/
            this.justPressedRate = 200;
            /**
            * The number of milliseconds below which the Pointer is considered justReleased
            * @property justReleasedRate
            * @type {Number}
            **/
            this.justReleasedRate = 200;
            /**
            * Sets if the Pointer objects should record a history of x/y coordinates they have passed through.
            * The history is cleared each time the Pointer is pressed down.
            * The history is updated at the rate specified in Input.pollRate
            * @property recordPointerHistory
            * @type {bool}
            **/
            this.recordPointerHistory = false;
            /**
            * The rate in milliseconds at which the Pointer objects should update their tracking history
            * @property recordRate
            * @type {Number}
            */
            this.recordRate = 100;
            /**
            * The total number of entries that can be recorded into the Pointer objects tracking history.
            * If the Pointer is tracking one event every 100ms, then a trackLimit of 100 would store the last 10 seconds worth of history.
            * @property recordLimit
            * @type {Number}
            */
            this.recordLimit = 100;
            /**
            * A Pointer object
            * @property pointer3
            * @type {Pointer}
            **/
            this.pointer3 = null;
            /**
            * A Pointer object
            * @property pointer4
            * @type {Pointer}
            **/
            this.pointer4 = null;
            /**
            * A Pointer object
            * @property pointer5
            * @type {Pointer}
            **/
            this.pointer5 = null;
            /**
            * A Pointer object
            * @property pointer6
            * @type {Pointer}
            **/
            this.pointer6 = null;
            /**
            * A Pointer object
            * @property pointer7
            * @type {Pointer}
            **/
            this.pointer7 = null;
            /**
            * A Pointer object
            * @property pointer8
            * @type {Pointer}
            **/
            this.pointer8 = null;
            /**
            * A Pointer object
            * @property pointer9
            * @type {Pointer}
            **/
            this.pointer9 = null;
            /**
            * A Pointer object
            * @property pointer10
            * @type {Pointer}
            **/
            this.pointer10 = null;
            /**
            * The most recently active Pointer object.
            * When you've limited max pointers to 1 this will accurately be either the first finger touched or mouse.
            * @property activePointer
            * @type {Pointer}
            **/
            this.activePointer = null;
            this.inputObjects = [];
            this.totalTrackedObjects = 0;
            this.game = game;
            this.mousePointer = new Phaser.Pointer(this.game, 0);
            this.pointer1 = new Phaser.Pointer(this.game, 1);
            this.pointer2 = new Phaser.Pointer(this.game, 2);
            this.mouse = new Phaser.Mouse(this.game);
            this.keyboard = new Phaser.Keyboard(this.game);
            this.touch = new Phaser.Touch(this.game);
            this.mspointer = new Phaser.MSPointer(this.game);
            //this.gestures = new Gestures(this.game);
            this.onDown = new Phaser.Signal();
            this.onUp = new Phaser.Signal();
            this.onTap = new Phaser.Signal();
            this.onHold = new Phaser.Signal();
            this.scale = new Phaser.Vec2(1, 1);
            this.speed = new Phaser.Vec2();
            this.position = new Phaser.Vec2();
            this._oldPosition = new Phaser.Vec2();
            this.circle = new Phaser.Circle(0, 0, 44);
            this.activePointer = this.mousePointer;
            this.currentPointers = 0;
            this.hitCanvas = document.createElement('canvas');
            this.hitCanvas.width = 1;
            this.hitCanvas.height = 1;
            this.hitContext = this.hitCanvas.getContext('2d');
        }
        InputManager.MOUSE_OVERRIDES_TOUCH = 0;
        InputManager.TOUCH_OVERRIDES_MOUSE = 1;
        InputManager.MOUSE_TOUCH_COMBINE = 2;
        Object.defineProperty(InputManager.prototype, "camera", {
            get: /**
            * The camera being used for mouse and touch based pointers to calculate their world coordinates.
            * This is only ever the camera set by the most recently active Pointer.
            * If you need to know exactly which camera a specific Pointer is over then see Pointer.camera instead.
            * @property camera
            * @type {Camera}
            **/
            function () {
                return this.activePointer.camera;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputManager.prototype, "x", {
            get: /**
            * The X coordinate of the most recently active pointer.
            * This value takes game scaling into account automatically. See Pointer.screenX/clientX for source values.
            * @property x
            * @type {Number}
            **/
            function () {
                return this._x;
            },
            set: function (value) {
                this._x = Math.floor(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputManager.prototype, "y", {
            get: /**
            * The Y coordinate of the most recently active pointer.
            * This value takes game scaling into account automatically. See Pointer.screenY/clientY for source values.
            * @property y
            * @type {Number}
            **/
            function () {
                return this._y;
            },
            set: function (value) {
                this._y = Math.floor(value);
            },
            enumerable: true,
            configurable: true
        });
        InputManager.prototype.addPointer = /**
        * Add a new Pointer object to the Input Manager. By default Input creates 2 pointer objects for you. If you need more
        * use this to create a new one, up to a maximum of 10.
        * @method addPointer
        * @return {Pointer} A reference to the new Pointer object
        **/
        function () {
            var next = 0;
            for(var i = 10; i > 0; i--) {
                if(this['pointer' + i] === null) {
                    next = i;
                }
            }
            if(next == 0) {
                throw new Error("You can only have 10 Pointer objects");
                return null;
            } else {
                this['pointer' + next] = new Phaser.Pointer(this.game, next);
                return this['pointer' + next];
            }
        };
        InputManager.prototype.boot = /**
        * Starts the Input Manager running
        * @method start
        **/
        function () {
            this.mouse.start();
            this.keyboard.start();
            this.touch.start();
            this.mspointer.start();
            //this.gestures.start();
            this.mousePointer.active = true;
        };
        InputManager.prototype.addGameObject = /**
        * Adds a new game object to be tracked by the Input Manager. Called by the Sprite.Input component, should not usually be called directly.
        * @method addGameObject
        **/
        function (object) {
            //  Find a spare slot
            for(var i = 0; i < this.inputObjects.length; i++) {
                if(this.inputObjects[i] == null) {
                    this.inputObjects[i] = object;
                    object.input.indexID = i;
                    this.totalTrackedObjects++;
                    return;
                }
            }
            //  If we got this far we need to push a new entry into the array
            object.input.indexID = this.inputObjects.length;
            this.inputObjects.push(object);
            this.totalTrackedObjects++;
        };
        InputManager.prototype.removeGameObject = /**
        * Removes a game object from the Input Manager. Called by the Sprite.Input component, should not usually be called directly.
        * @method removeGameObject
        **/
        function (index) {
            if(this.inputObjects[index]) {
                this.inputObjects[index] = null;
            }
        };
        Object.defineProperty(InputManager.prototype, "pollLocked", {
            get: function () {
                return (this.pollRate > 0 && this._pollCounter < this.pollRate);
            },
            enumerable: true,
            configurable: true
        });
        InputManager.prototype.update = /**
        * Updates the Input Manager. Called by the core Game loop.
        * @method update
        **/
        function () {
            if(this.pollRate > 0 && this._pollCounter < this.pollRate) {
                this._pollCounter++;
                return;
            }
            this.speed.x = this.position.x - this._oldPosition.x;
            this.speed.y = this.position.y - this._oldPosition.y;
            this._oldPosition.copyFrom(this.position);
            this.mousePointer.update();
            this.pointer1.update();
            this.pointer2.update();
            if(this.pointer3) {
                this.pointer3.update();
            }
            if(this.pointer4) {
                this.pointer4.update();
            }
            if(this.pointer5) {
                this.pointer5.update();
            }
            if(this.pointer6) {
                this.pointer6.update();
            }
            if(this.pointer7) {
                this.pointer7.update();
            }
            if(this.pointer8) {
                this.pointer8.update();
            }
            if(this.pointer9) {
                this.pointer9.update();
            }
            if(this.pointer10) {
                this.pointer10.update();
            }
            this._pollCounter = 0;
        };
        InputManager.prototype.reset = /**
        * Reset all of the Pointers and Input states
        * @method reset
        * @param hard {bool} A soft reset (hard = false) won't reset any signals that might be bound. A hard reset will.
        **/
        function (hard) {
            if (typeof hard === "undefined") { hard = false; }
            this.keyboard.reset();
            this.mousePointer.reset();
            for(var i = 1; i <= 10; i++) {
                if(this['pointer' + i]) {
                    this['pointer' + i].reset();
                }
            }
            this.currentPointers = 0;
            this.game.stage.canvas.style.cursor = "default";
            if(hard == true) {
                this.onDown.dispose();
                this.onUp.dispose();
                this.onTap.dispose();
                this.onHold.dispose();
                this.onDown = new Phaser.Signal();
                this.onUp = new Phaser.Signal();
                this.onTap = new Phaser.Signal();
                this.onHold = new Phaser.Signal();
                for(var i = 0; i < this.totalTrackedObjects; i++) {
                    if(this.inputObjects[i] && this.inputObjects[i].input) {
                        this.inputObjects[i].input.reset();
                    }
                }
                this.inputObjects.length = 0;
                this.totalTrackedObjects = 0;
            }
            this._pollCounter = 0;
        };
        InputManager.prototype.resetSpeed = function (x, y) {
            this._oldPosition.setTo(x, y);
            this.speed.setTo(0, 0);
        };
        Object.defineProperty(InputManager.prototype, "totalInactivePointers", {
            get: /**
            * Get the total number of inactive Pointers
            * @method totalInactivePointers
            * @return {Number} The number of Pointers currently inactive
            **/
            function () {
                return 10 - this.currentPointers;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputManager.prototype, "totalActivePointers", {
            get: /**
            * Recalculates the total number of active Pointers
            * @method totalActivePointers
            * @return {Number} The number of Pointers currently active
            **/
            function () {
                this.currentPointers = 0;
                for(var i = 1; i <= 10; i++) {
                    if(this['pointer' + i] && this['pointer' + i].active) {
                        this.currentPointers++;
                    }
                }
                return this.currentPointers;
            },
            enumerable: true,
            configurable: true
        });
        InputManager.prototype.startPointer = /**
        * Find the first free Pointer object and start it, passing in the event data.
        * @method startPointer
        * @param {Any} event The event data from the Touch event
        * @return {Pointer} The Pointer object that was started or null if no Pointer object is available
        **/
        function (event) {
            if(this.maxPointers < 10 && this.totalActivePointers == this.maxPointers) {
                return null;
            }
            //  Unrolled for speed
            if(this.pointer1.active == false) {
                return this.pointer1.start(event);
            } else if(this.pointer2.active == false) {
                return this.pointer2.start(event);
            } else {
                for(var i = 3; i <= 10; i++) {
                    if(this['pointer' + i] && this['pointer' + i].active == false) {
                        return this['pointer' + i].start(event);
                    }
                }
            }
            return null;
        };
        InputManager.prototype.updatePointer = /**
        * Updates the matching Pointer object, passing in the event data.
        * @method updatePointer
        * @param {Any} event The event data from the Touch event
        * @return {Pointer} The Pointer object that was updated or null if no Pointer object is available
        **/
        function (event) {
            //  Unrolled for speed
            if(this.pointer1.active && this.pointer1.identifier == event.identifier) {
                return this.pointer1.move(event);
            } else if(this.pointer2.active && this.pointer2.identifier == event.identifier) {
                return this.pointer2.move(event);
            } else {
                for(var i = 3; i <= 10; i++) {
                    if(this['pointer' + i] && this['pointer' + i].active && this['pointer' + i].identifier == event.identifier) {
                        return this['pointer' + i].move(event);
                    }
                }
            }
            return null;
        };
        InputManager.prototype.stopPointer = /**
        * Stops the matching Pointer object, passing in the event data.
        * @method stopPointer
        * @param {Any} event The event data from the Touch event
        * @return {Pointer} The Pointer object that was stopped or null if no Pointer object is available
        **/
        function (event) {
            //  Unrolled for speed
            if(this.pointer1.active && this.pointer1.identifier == event.identifier) {
                return this.pointer1.stop(event);
            } else if(this.pointer2.active && this.pointer2.identifier == event.identifier) {
                return this.pointer2.stop(event);
            } else {
                for(var i = 3; i <= 10; i++) {
                    if(this['pointer' + i] && this['pointer' + i].active && this['pointer' + i].identifier == event.identifier) {
                        return this['pointer' + i].stop(event);
                    }
                }
            }
            return null;
        };
        InputManager.prototype.getPointer = /**
        * Get the next Pointer object whos active property matches the given state
        * @method getPointer
        * @param {bool} state The state the Pointer should be in (false for inactive, true for active)
        * @return {Pointer} A Pointer object or null if no Pointer object matches the requested state.
        **/
        function (state) {
            if (typeof state === "undefined") { state = false; }
            //  Unrolled for speed
            if(this.pointer1.active == state) {
                return this.pointer1;
            } else if(this.pointer2.active == state) {
                return this.pointer2;
            } else {
                for(var i = 3; i <= 10; i++) {
                    if(this['pointer' + i] && this['pointer' + i].active == state) {
                        return this['pointer' + i];
                    }
                }
            }
            return null;
        };
        InputManager.prototype.getPointerFromIdentifier = /**
        * Get the Pointer object whos identified property matches the given identifier value
        * @method getPointerFromIdentifier
        * @param {Number} identifier The Pointer.identifier value to search for
        * @return {Pointer} A Pointer object or null if no Pointer object matches the requested identifier.
        **/
        function (identifier) {
            //  Unrolled for speed
            if(this.pointer1.identifier == identifier) {
                return this.pointer1;
            } else if(this.pointer2.identifier == identifier) {
                return this.pointer2;
            } else {
                for(var i = 3; i <= 10; i++) {
                    if(this['pointer' + i] && this['pointer' + i].identifier == identifier) {
                        return this['pointer' + i];
                    }
                }
            }
            return null;
        };
        Object.defineProperty(InputManager.prototype, "worldX", {
            get: function () {
                if(this.camera) {
                    return (this.camera.worldView.x - this.camera.screenView.x) + this.x;
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputManager.prototype, "worldY", {
            get: function () {
                if(this.camera) {
                    return (this.camera.worldView.y - this.camera.screenView.y) + this.y;
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        InputManager.prototype.getDistance = /**
        * Get the distance between two Pointer objects
        * @method getDistance
        * @param {Pointer} pointer1
        * @param {Pointer} pointer2
        **/
        function (pointer1, pointer2) {
            return Phaser.Vec2Utils.distance(pointer1.position, pointer2.position);
        };
        InputManager.prototype.getAngle = /**
        * Get the angle between two Pointer objects
        * @method getAngle
        * @param {Pointer} pointer1
        * @param {Pointer} pointer2
        **/
        function (pointer1, pointer2) {
            return Phaser.Vec2Utils.angle(pointer1.position, pointer2.position);
        };
        InputManager.prototype.pixelPerfectCheck = function (sprite, pointer, alpha) {
            if (typeof alpha === "undefined") { alpha = 255; }
            this.hitContext.clearRect(0, 0, 1, 1);
            return true;
        };
        return InputManager;
    })();
    Phaser.InputManager = InputManager;    
})(Phaser || (Phaser = {}));
