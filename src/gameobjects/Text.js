Phaser.Text = function (game, x, y, text, style) {

    x = x || 0;
    y = y || 0;
    text = text || '';
    style = style || '';

    PIXI.Text.call(this, text, style);

    /*
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");

	var canvasID = game.rnd.uuid();

	PIXI.TextureCache[canvasID] = new PIXI.Texture(new PIXI.BaseTexture(this.canvas));

	Phaser.Sprite.call(this, game, x, y, canvasID);

    this.type = Phaser.TEXT;

    this.setText(text);
    this.setStyle(style);
    
    this.updateText();
    this.dirty = false;
    */

};

// Phaser.Text.prototype = Phaser.Utils.extend(true, Phaser.Sprite.prototype, PIXI.Text.prototype);
Phaser.Text.prototype = Phaser.Utils.extend(true, PIXI.Text.prototype);
Phaser.Text.prototype.constructor = Phaser.Text;

//  Add our own custom methods
