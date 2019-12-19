export { Player }

import * as TBX from "toybox-engine";

class Player extends TBX.Tile
{
    public static Current:Player;
    public CurrentSize:number;
    private _Scene:TBX.Scene2D;
    private _Velocity:TBX.Vertex;
    public constructor(Old?:Player, Scene?:TBX.Scene2D)
    {
        super(Old);
        this._Scene = Scene;
        if(Old)
        {
            //TODO
        }
        else
        {
            this.Init();
            Player.Current = this;
        }
    }
    private Init() : void
    {
        this.Fixed = true;
        this.CurrentSize = 100;
        this.Size = new TBX.Vertex(100,100,1);
        this.Position = new TBX.Vertex(960,540,0.4);
        this._Velocity = new TBX.Vertex();
        this.Paint = TBX.Color.White;
        let ArtIndex:number = TBX.Random.Next(0, 3);
        this.Collection = new TBX.ImageCollection(null, ["Resources/Textures/org0.png"]);
        this.Index = 0;
        this._Scene.Attach(this);
    }
    public Reset() : void
    {
        this.Paint = TBX.Color.White;
        this.CurrentSize = 100;
        this.Position = new TBX.Vertex(960,540,0.4);
        this._Scene.Trans.Translation = new TBX.Vertex();
    }
    public KeyDown(G:TBX.Game, Args:any) : void
    {
        //console.log(Args.KeyCode);
        let Factor:number = 3;
        if(Args.KeyCode == 87 || Args.KeyCode == 38)
        {
            //console.log("up");
            this._Velocity.Y = -Factor;
        }
        if(Args.KeyCode == 83 || Args.KeyCode == 40)
        {
            //console.log("down");
            this._Velocity.Y = +Factor;
        }
        if(Args.KeyCode == 65 || Args.KeyCode == 37)
        {
            //console.log("left");
            this._Velocity.X = -Factor;
        }
        if(Args.KeyCode == 68 || Args.KeyCode == 39)
        {
            //console.log("right");
            this._Velocity.X = +Factor;
        }
    }
    public SetDirection(Direction:TBX.Vertex)
    {
        this._Velocity = Direction.Normalize().Scalar(3);
    }
    public KeyUp(G:TBX.Game, Args:any) : void
    {
        //this._Velocity = new TBX.Vertex(0,0,0);
    }
    public Update() : void
    {
        //this.Trans.Scale.X = this.CurrentSize;
        //this.Trans.Scale.Y = this.CurrentSize;
        this._Scene.Trans.Translation.Add(this._Velocity.Copy().Scalar(-1.0));
        //this.Trans.Translation = this.Trans.Translation.Add(this._Velocity);
        this.Trans.Rotation.Z += 1;
    }
    private GameOver() : void
    {
        TBX.Runner.Current.SwitchScene("GameOver");
    }
    public Eat(Size:number, Color:TBX.Color) : void
    {
        let NewC = this.CompositeColor(this.Paint, Color);
        if(Size > this.CurrentSize)
        {
            this.GameOver();
            return;
        }
        this.Paint = NewC;
        this.Modified = true;
        let CResult:boolean = this.CalculateColorMatch(this.Paint, Color);
        if(CResult) this.CurrentSize += Size / 2;
        else this.CurrentSize -= Size / 4;
        if(this.CurrentSize < 100)
        {
            this.CurrentSize = 100;
            this.GameOver();
            return;
        }
    }
    private CalculateColorMatch(Color1:TBX.Color, Color2:TBX.Color) : boolean
    {
        let C1A = [(Color1.R) / 255.0, (Color1.G) / 255.0, (Color1.B) / 255.0];
        let C2A = [(Color2.R) / 255.0, (Color2.G) / 255.0, (Color2.B) / 255.0];
        let CFA = [C1A[0] * C2A[0], C1A[1] * C2A[1], C1A[2] * C2A[2]];
        if(CFA[0] + CFA[1] + CFA[2] < 0.6) return false; 
        return true;
    }
    private CompositeColor(Color1:TBX.Color, Color2:TBX.Color) : TBX.Color
    {
        let C1A = [(Color1.R) / 255.0, (Color1.G) / 255.0, (Color1.B) / 255.0];
        let C2A = [(Color2.R) / 255.0, (Color2.G) / 255.0, (Color2.B) / 255.0];
        let CFA = [C1A[0] + C2A[0], C1A[1] + C2A[1], C1A[2] + C2A[2]];
        CFA[0] /= 2;
        CFA[1] /= 2;
        CFA[2] /= 2;
        let ColorF:TBX.Color = TBX.Color.FromRGBA(Math.round(CFA[0] * 255), Math.round(CFA[1] * 255), Math.round(CFA[2] * 255), 255);
        return ColorF;
    }
}