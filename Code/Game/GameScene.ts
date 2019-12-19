export { GameScene };

import * as TBX from "toybox-engine";

import { Level } from "./Elements/Level";
import { Player } from "./Elements/Player";

class GameScene extends TBX.Scene2D
{
    public static Current:GameScene;
    private _MouseDown:boolean;
    private _Score:number;
    private _Level:Level;
    private _Player:Player;
    private _PlayerColor:TBX.Tile;
    private _OppositeColor:TBX.Tile;
    private _ScoreLabel:TBX.Label;
    public get Score():number { return this._Score; }
    public constructor(Old?:GameScene)
    {
        super(Old);
        if(Old)
        {
            //TODO
        }
        else
        {
            this._MouseDown = false;
            this.InitGameScene();
            GameScene.Current = this;
        }
    }
    private InitGameScene() : void
    {
        this.Name = "Game";
        this.CreateBackground("Back");
        this.Events.KeyDown.push(this.KeyDown.bind(this));
        this.Events.KeyUp.push(this.KeyUp.bind(this));
        this.Events.Update.push(this.Update.bind(this));
        this.Events.MouseDown.push(this.MouseDown.bind(this));
        this.Events.MouseUp.push(this.MouseUp.bind(this));
        this.Events.MouseMove.push(this.MouseMove.bind(this));
        this._Level = new Level(null, this);
        this._Player = new Player(null, this);
        this._Score = 0;
        this._ScoreLabel = this.CreateLabel("0");
        this._PlayerColor = TBX.SceneObjectUtil.CreateTile("PlayerColor", ["Resources/Textures/Pallete.png"], new TBX.Vertex(80, 90, 0.8), new TBX.Vertex(60, 60, 1));
        this._PlayerColor.Fixed = true;
        this.Attach(this._PlayerColor);
        this.CreateSmallLabel("You", new TBX.Vertex(80, 50, 0.8), 20);
        this._OppositeColor = TBX.SceneObjectUtil.CreateTile("OppositeColor", ["Resources/Textures/Pallete.png"], new TBX.Vertex(160, 70, 0.8), new TBX.Vertex(40, 40, 1));
        this._OppositeColor.Fixed = true;
        this.CreateSmallLabel("Opposite", new TBX.Vertex(160, 40, 0.8), 15);
        this.Attach(this._OppositeColor);
    }
    public Reset() : void
    {
        this._ScoreLabel.Text = "0";
        this._Player.Reset();
        this._Level.Reset();
    }
    private Update() : void
    {
        this._Player.Update();
        this._Level.Update();
        this._Score = Math.floor(this._Player.CurrentSize - 100);
        this._ScoreLabel.Text = this._Score.toString();
        this._ScoreLabel.Update();
        this._PlayerColor.Paint = this._Player.Paint;
        this._PlayerColor.Modified = true;
        this._OppositeColor.Paint = this.InvertColor(this._Player.Paint);
        this._OppositeColor.Modified = true;
    }
    private InvertColor(Color:TBX.Color) : TBX.Color
    {
        return TBX.Color.FromRGBA(255 - Color.R, 255 - Color.G, 255 - Color.B, 255);
    }
    private KeyDown(G:TBX.Game, Args:any) : void
    {
        this._Player.KeyDown(G, Args);
    }
    private KeyUp(G:TBX.Game, Args:any) : void
    {
        this._Player.KeyUp(G, Args);
    }
    private MouseDown() : void
    {
        this._MouseDown = true;
    }
    private MouseUp() : void
    {
        this._MouseDown = false;
    }
    private MouseMove(G:TBX.Game, Args:any) : void
    {
        let Direction:TBX.Vertex = Args.Location;
        Direction.Translate(new TBX.Vertex(-960, -540, 0));
        this._Player.SetDirection(Direction);
    }
    protected CreateBackground(Name:string) : void
    {
        let Back:TBX.Tile = TBX.SceneObjectUtil.CreateTile(Name, ["Resources/Textures/Backgrounds/"+Name+".png"], new TBX.Vertex(960,540), new TBX.Vertex(1920, 1080, 1));
        Back.Fixed = true;
        this.Attach(Back);
    }
    protected CreateLabel(Text:string) : TBX.Label
    {
        let Label:TBX.Label = new TBX.Label(null, Text);
        Label.Size = new TBX.Vertex(800, 80);
        Label.TextSize = 60;
        Label.Position = new TBX.Vertex(960, 100, 0.2);
        Label.ForeColor = TBX.Color.FromRGBA(138,43,226,255);
        Label.Border.Width = 0;
        this.Attach(Label);
        return Label;
    }
    protected CreateSmallLabel(Text:string, Position:TBX.Vertex, Size:number) : TBX.Label
    {
        let Label:TBX.Label = new TBX.Label(null, Text);
        Label.Size = new TBX.Vertex(100, 40);
        Label.TextSize = Size;
        Label.Position = Position;
        Label.ForeColor = TBX.Color.White;
        Label.Border.Width = 0;
        this.Attach(Label);
        return Label;
    }
}