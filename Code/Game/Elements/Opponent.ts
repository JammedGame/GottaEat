export { Opponent }

import * as TBX from "toybox-engine";

import { Player } from "./Player";

class Opponent extends TBX.Tile
{
    private _Timer:number;
    private _CurrentSize:number;
    private _InternalSize:number;
    private _Scene:TBX.Scene2D;
    private _Velocity:TBX.Vertex;
    public get CurrentSize():number { return this._CurrentSize; }
    public constructor(Old?:Opponent, Scene?:TBX.Scene2D, Size?:number)
    {
        super(Old);
        this._Scene = Scene;
        if(Old)
        {
            //TODO
        }
        else
        {
            this.Init(Size);
            this._Scene = Scene;
            this._Scene.Attach(this);
        }
    }
    private Init(Size) : void
    {
        this._Timer = 0;
        this._CurrentSize = Size;
        let PlayerSize = 100;
        if(Player.Current) PlayerSize = Player.Current.CurrentSize;
        this._InternalSize = 100 * (this._CurrentSize / PlayerSize);
        this.Size = new TBX.Vertex(this._InternalSize, this._InternalSize, 1);
        this.Position = new TBX.Vertex(-this._Scene.Trans.Translation.X + this.GenBoolInt() * TBX.Random.Next(200, 1000) + 960,
                                        -this._Scene.Trans.Translation.Y + this.GenBoolInt() * TBX.Random.Next(200, 600) + 540, 0.4);
        let ArtIndex:number = TBX.Random.Next(1, 4);
        this.Collection = new TBX.ImageCollection(null, ["Resources/Textures/org"+ArtIndex+".png"]);
        this.Index = 0;
        this._Velocity = new TBX.Vertex(0, 1.8, 0);
        this._Velocity.RotateZ(TBX.Random.Next(0, 359));
        this.Paint = TBX.Color.FromRGBA(TBX.Random.Next(0, 255), TBX.Random.Next(0, 255), TBX.Random.Next(0, 255), 255);
    }
    public Reset() : void
    {
        this.Position = new TBX.Vertex(200,400,0.4);
        this._Scene.Trans.Translation = new TBX.Vertex();
    }
    public Update() : void
    {
        this.Trans.Rotation.Z += 1;
        this.Trans.Translation.Add(this._Velocity);
        let TargetSize = 100 * (this._CurrentSize / Player.Current.CurrentSize);
        if(this._InternalSize / TargetSize < 1.1 && this._InternalSize / TargetSize > 0.9)
        {
            this._InternalSize = TargetSize;
        }
        else 
        {
            if(this._InternalSize < TargetSize)
            {
                this._InternalSize += (TargetSize - this._InternalSize) / 60;
            }
            else
            {
                this._InternalSize -= (this._InternalSize - TargetSize) / 60;
            }
        }
        this.Trans.Scale.X = this._InternalSize;
        this.Trans.Scale.Y = this._InternalSize;
        this._Timer++;
        if(this._Timer > 60)
        {
            this._Velocity.RotateZ(TBX.Random.Next(-30, 30));
        }
    }
    public SetDirection(Direction:TBX.Vertex)
    {
        this._Velocity = Direction.Normalize().Scalar(1.8);
    }
    public GenBoolInt() : number
    {
        let Val = TBX.Random.Next(1,2);
        if(Val == 1) return -1.0;
        else return 1.0;
    }
}