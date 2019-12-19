export { Level }

import * as TBX from "toybox-engine";
import { Player } from "./Player";
import { Opponent } from "./Opponent";

const Ammount = 20;

class Level
{
    private _Scene:TBX.Scene2D;
    private _Opponents:Opponent[];
    public constructor(Old?:Level, Scene?:TBX.Scene2D)
    {
        this._Scene = Scene;
        if(Old)
        {
            //TODO
        }
        else
        {
            this.Init();
        }
    }
    private Init() : void
    {
        this._Opponents = [];
        for(let i = 0; i < Ammount; i++)
        {
            this.SpawnOponent();
        }
    }
    public Reset() : void
    {
        for(let i = this._Opponents.length - 1; i >= 0; i--)
        {
            this._Scene.Remove(this._Opponents[i]);
            this._Opponents.splice(i, 1);
        }
        this.Init();
    }
    public Update(): void
    {
        for(let i = this._Opponents.length - 1; i >= 0; i--)
        {
            if(Math.abs(this._Opponents[i].Trans.Translation.X - (960 - this._Scene.Trans.Translation.X)) > 1000)
            {
                this._Scene.Remove(this._Opponents[i]);
                this._Opponents.splice(i, 1);
            }
            else if(Math.abs(this._Opponents[i].Trans.Translation.Y - (540 - this._Scene.Trans.Translation.Y)) > 600)
            {
                this._Scene.Remove(this._Opponents[i]);
                this._Opponents.splice(i, 1);
            }
            else if(Math.abs(this._Opponents[i].Trans.Translation.X - (960 - this._Scene.Trans.Translation.X)) < 50 &&
            Math.abs(this._Opponents[i].Trans.Translation.Y - (540 - this._Scene.Trans.Translation.Y)) < 50)
            {
                Player.Current.Eat(this._Opponents[i].CurrentSize, this._Opponents[i].Paint);
                this._Scene.Remove(this._Opponents[i]);
                this._Opponents.splice(i, 1);
            }
            else
            {
                if(Math.abs(this._Opponents[i].Trans.Translation.X - (960 - this._Scene.Trans.Translation.X)) < 350 &&
                Math.abs(this._Opponents[i].Trans.Translation.Y - (540 - this._Scene.Trans.Translation.Y)) < 350 &&
                this._Opponents[i].CurrentSize > Player.Current.CurrentSize)
                {
                    let Direction:TBX.Vertex = new TBX.Vertex(this._Opponents[i].Trans.Translation.X - (960 - this._Scene.Trans.Translation.X),
                                                                this._Opponents[i].Trans.Translation.Y - (540 - this._Scene.Trans.Translation.Y));
                    this._Opponents[i].SetDirection(Direction.Scalar(-1));
                }
                else if(Math.abs(this._Opponents[i].Trans.Translation.X - (960 - this._Scene.Trans.Translation.X)) < 350 &&
                Math.abs(this._Opponents[i].Trans.Translation.Y - (540 - this._Scene.Trans.Translation.Y)) < 350 &&
                this._Opponents[i].CurrentSize < Player.Current.CurrentSize)
                {
                    let Direction:TBX.Vertex = new TBX.Vertex(this._Opponents[i].Trans.Translation.X - (960 - this._Scene.Trans.Translation.X),
                                                                this._Opponents[i].Trans.Translation.Y - (540 - this._Scene.Trans.Translation.Y));
                    this._Opponents[i].SetDirection(Direction.Scalar(1));
                }
                this._Opponents[i].Update();
            }
        }
        while(this._Opponents.length < Ammount)
        {
            this.SpawnOponent();
        }
    }
    public SpawnOponent() : void
    {
        let Size:number = 100;
        if(Player.Current) Size = Player.Current.CurrentSize;
        Size *= 0.2 + (Math.random() * 1.2);
        let NO:Opponent = new Opponent(null, this._Scene, Size);
        this._Opponents.push(NO);
    }
}