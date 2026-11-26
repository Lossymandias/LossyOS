import {gAttrVisStyle,getSizeCanvas,gAttrDefaultWin} from "./gAttr.js";
import { EX_winExec,EXP_wEMain, winFactoryEx} from "./winExec.js";
import { EX_winP, drawBitmapText, measureBitmapText} from "./winUtils.js";

const PIXEL_FONT_SIZE = 8; // 8px or 16px works cleanest for pixel fonts
const PIXEL_FONT = `${PIXEL_FONT_SIZE}px "Press Start 2P", monospace`;

const inside = (a,b) => a[0] > b[0] && a[0] < b[0] + b[2] && a[1] > b[1] && a[1] < b[1] + b[3];

class winBar{
    constructor(title, winP) {
        this._BarTitle = title;
        this._BarWinP = winP;
    }

    draw(ctx){
     
        let s  =zip([this._BarWinP.getRect(), [0.5,0.5,0, - this._BarWinP.getRect()[3] + gAttrVisStyle["BASE"].winBarHeight]]).map(t=> t[0] + t[1]);
        ctx.fillStyle = gAttrVisStyle["BASE"].winBarBkd;
        ctx.fillRect(...s);

        const orRender = function (ctx, t, dst) {
            ctx.strokeStyle = gAttrVisStyle["BASE"].winBkd;
            ctx.lineWidth = 1;
            ctx.strokeRect(...(zip([t,[+dst, +dst, -dst*2, -dst*2]]).map(t => t[0] + t[1])));
        }.bind(this);

        let sBoxClose = zip([this._BarWinP.getRect(), [
            this._BarWinP.getRect()[2]+0.5 - gAttrVisStyle["BASE"].winBarHeight - gAttrVisStyle["BASE"].winBorSpace*1.5,
            0.5,
            - this._BarWinP.getRect()[2] + gAttrVisStyle["BASE"].winBarHeight, - this._BarWinP.getRect()[3] + gAttrVisStyle["BASE"].winBarHeight]]).map(t=> t[0] + t[1]);
        
        orRender(ctx, sBoxClose,0);
        orRender(ctx, sBoxClose,gAttrVisStyle["BASE"].winBorSpace);

        drawBitmapText(ctx, "✕", 
            sBoxClose[0] -measureBitmapText("✕",1).width + sBoxClose[2]*0.5+2.5,
            sBoxClose[1]- measureBitmapText("✕",1).height+ sBoxClose[3]*0.5+2.5,
            1, "#ffffff");
        
        let sBoxChangeSpace = zip([this._BarWinP.getRect(), [
            this._BarWinP.getRect()[2]+0.5 - gAttrVisStyle["BASE"].winBarHeight*2 - gAttrVisStyle["BASE"].winBorSpace*1.5,
            0.5,
            - this._BarWinP.getRect()[2] + gAttrVisStyle["BASE"].winBarHeight, - this._BarWinP.getRect()[3] + gAttrVisStyle["BASE"].winBarHeight]]).map(t=> t[0] + t[1]);
        
        drawBitmapText(ctx, "-", 
            sBoxChangeSpace[0] -measureBitmapText("✕",1).width + sBoxChangeSpace[2]*0.5+2.5,
            sBoxChangeSpace[1]- measureBitmapText("✕",1).height+ sBoxChangeSpace[3]*0.5+3.5,
            1, "#ffffff");
        
        orRender(ctx, sBoxChangeSpace,0);
        orRender(ctx, sBoxChangeSpace,gAttrVisStyle["BASE"].winBorSpace);
        
        ctx.fillStyle = "White";
        drawBitmapText(ctx, this._BarTitle, ...zip([this._BarWinP.getRect().slice(0,2),[0,+gAttrVisStyle["BASE"].winBarHeight - 10]]).map(t => t[0] + t[1]), 1, "#ffffff");

    }

    grabIsMouseInside(mPos){
        let s  = zip([this._BarWinP.getRect(), [0.5,0.5,0, - this._BarWinP.getRect()[3] + gAttrVisStyle["BASE"].winBarHeight]]).map(t=> t[0] + t[1]);
        return inside(mPos, s);
    }

    grabIsMouseInsideButtons(mPos){
        let sBoxClose = zip([this._BarWinP.getRect(), [
            this._BarWinP.getRect()[2]+0.5 - gAttrVisStyle["BASE"].winBarHeight - gAttrVisStyle["BASE"].winBorSpace,
            0.5,
            - this._BarWinP.getRect()[2] + gAttrVisStyle["BASE"].winBarHeight, - this._BarWinP.getRect()[3] + gAttrVisStyle["BASE"].winBarHeight]]).map(t=> t[0] + t[1]);
    
        let sBoxChangeSpace = zip([this._BarWinP.getRect(), [
            this._BarWinP.getRect()[2]+0.5 - gAttrVisStyle["BASE"].winBarHeight*2 - gAttrVisStyle["BASE"].winBorSpace,
            0.5,
            - this._BarWinP.getRect()[2] + gAttrVisStyle["BASE"].winBarHeight, - this._BarWinP.getRect()[3] + gAttrVisStyle["BASE"].winBarHeight]]).map(t=> t[0] + t[1]);
        
        return inside(mPos, sBoxClose) ? 1 : inside(mPos, sBoxChangeSpace) ? 2 : 0;
    }

    grabContext(mPos, parent){}
}


let zip= rows=>rows[0].map((_,c)=>rows.map(row=>row[c]))
const sum = a => a.reduce((acc, val) => acc + (Number(val) || 0), 0);
class EX_winR{
    constructor(sstrdId, title, strSize, strPos, runContent, strState) {
        this._RWinP = new EX_winP(
            [Math.floor(strPos[0]*getSizeCanvas()[0]),Math.floor(strPos[1]*getSizeCanvas()[1])], 
            strSize);
        
        this._RWinEx = winFactoryEx(runContent, this._RWinP);

        this._RTitle = title;
        this._RWinBar = new winBar(title, this._RWinP);
        this._RAttrOnUpdate = true;

        this._ROnDrag = false;
        this._ROnOffset = [0,0];

        this._RIsRendered = strState;
        this._RRequiredAction = 0;
    }

    getTitle(){return this._RTitle;}
    getIsRendered(){return this._RIsRendered;}
    setIsRendered(v){this._RIsRendered = v;}
    onUpdate(ctx){this._RAttrOnUpdate |= this._RWinBar.hasToUpdate() | this._RWinEx.hasToUpdate() | this.hasToUpdate();}

    draw(ctx){
        if(!this._RAttrOnUpdate)
            return;
        const brRender = function (ctx) {
            ctx.fillStyle = gAttrVisStyle["BASE"].winBkd;
            ctx.fillRect(...this._RWinP.getRect());
        }.bind(this);

        const orRender = function (ctx, dst) {
            ctx.strokeStyle = gAttrVisStyle["BASE"].winBorBkd;
            ctx.lineWidth = 1;
            ctx.strokeRect(...(zip([this._RWinP.getRect(),[+dst + 0.5, +dst + 0.5, -dst*2, -dst*2]]).map(t => t[0] + t[1])));
        }.bind(this);

        brRender(ctx);
        orRender(ctx, 0);
        orRender(ctx, gAttrVisStyle["BASE"].winBorSpace);
        this._RWinEx.draw(ctx);
        this._RWinBar.draw(ctx);
    }

    grabContext(mPos, mState, mChange){
        let s  = this._RWinP.getRect();
        let focused = mChange && mState[0] && mPos[0] > s[0] && mPos[0] < s[0] + s[2] && mPos[1] > s[1] && mPos[1] < s[1] + s[3];

        if(mChange && mState[0] && this._RWinBar.grabIsMouseInside(mPos)){
            this._ROnDrag = true;
            this._ROnOffset = zip([this._RWinP.getPos(),mPos]).map(t => t[0] - t[1]);
        
        }else if(mChange && !mState[0])
            this._ROnDrag = false;


        let act = mChange && mState[0] ? this._RWinBar.grabIsMouseInsideButtons(mPos) : 0;

        if(act == 2){
            this._RWinP.swapMaxmimizeMinimize();
            focused = true;
        }else if(act != 0){
            this._ROnDrag = false;
            this._RRequiredAction = act;
            this._RIsRendered = false;
        }
        
        if(this._ROnDrag){
            this._RWinP.setPos([mPos[0] + this._ROnOffset[0],mPos[1] + this._ROnOffset[1]]);
            this._RAttrOnUpdate = true;
        }

        const mrPos = this._RWinP.getRelMouse(mPos);
        this._RWinBar.grabContext(mrPos, this);
        return focused;
    }
    getRequiredAction(){return this._RRequiredAction;}
    clearRequiredAction(){ this._RRequiredAction = 0;}
}

const pDate = new Intl.DateTimeFormat('en-US', {
    weekday : 'short',
    month : 'short',
    day : '2-digit',
    hour : '2-digit',
    minute : '2-digit',
    year : 'numeric',
    hour12: false
});

class winBBarIcons{
    constructor(t,winP){ 
        this._BBIWinP = winP; 
        this._BBIT = t;
    }

    draw(ctx, f) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;

        const title = this._BBIT.getTitle();
        const metrics = measureBitmapText(title, 1);

        const padX = 4;
        const padY = 2;
        const boxWidth = metrics.width + padX * 2;
        const boxHeight = metrics.height + padY * 2;

        const barHeight = gAttrVisStyle["BASE"].winBottomBarHeigh;
        const canvasHeight = getSizeCanvas()[1];

        const boxX = Math.round(f + barHeight * 0.25);
        const boxY = Math.round(canvasHeight - barHeight * 0.5 - boxHeight * 0.5);

        ctx.fillStyle = this._BBIT.getIsRendered() ? "#ffffff" : "#aaaaaa";
        ctx.fillRect(boxX, boxY, boxWidth, 1);
        ctx.fillRect(boxX, boxY + boxHeight - 1, boxWidth, 1);
        ctx.fillRect(boxX, boxY, 1, boxHeight);
        ctx.fillRect(boxX + boxWidth - 1, boxY, 1, boxHeight);

        drawBitmapText(ctx, title, boxX + padX, boxY + padY, 1, this._BBIT.getIsRendered() ? "#ffffff" : "#aaaaaa");

        ctx.restore();
        return boxWidth;
    }

    getP(){return this._BBIWinP; }

    grabContext(mPos, mState,mChange){ return mChange && mState[0] && inside(mPos, this._BBIWinP.getRect());}
}

class winBBar{

    constructor(){ this._BBIcons = []; }

    addWin(win){
        const padX = 4;
        const padY = 2;

           this._BBIcons.push(new winBBarIcons(win, new EX_winP(
            [(this._BBIcons.length == 0 ? 0 : this._BBIcons[this._BBIcons.length-1].getP().getRect()[0] + this._BBIcons[this._BBIcons.length-1].getP().getRect()[2]) + padX ,getSizeCanvas()[1] - gAttrVisStyle["BASE"].winBottomBarHeigh],
            [measureBitmapText(win.getTitle(), 1).width+padX*2,gAttrVisStyle["BASE"].winBottomBarHeigh])));
    }

    draw(ctx){
        ctx.fillStyle = "Black";
        ctx.fillRect(...[0,getSizeCanvas()[1]-gAttrVisStyle["BASE"].winBottomBarHeigh,getSizeCanvas()[0],gAttrVisStyle["BASE"].winBottomBarHeigh]);
        
        ctx.font = "10px Arial";
        ctx.fillStyle = "White";
        const p = pDate.formatToParts(new Date());
        const get = (type) =>  p.find(p=> p.type === type).value;

        let t = `${get('weekday')} ${get('month')}  ${get('hour')}:${get('minute')}  ${get('year')}`;
        
        drawBitmapText(ctx, t, 
            getSizeCanvas()[0]-measureBitmapText(t,1).width,
            getSizeCanvas()[1] - gAttrVisStyle["BASE"].winBottomBarHeigh*0.75,
            1, "#ffffff");

        let gap = 4;
        let cursor = 0;

        this._BBIcons.forEach((g) => {cursor += g.draw(ctx, cursor) + gap;});
        
    }

    grabContext(mPos, mState, mChange){ return this._BBIcons.findIndex((r) => r.grabContext(mPos, mState, mChange));}  
}

class EX_winM{
    constructor(){
        this._RWins = []
        this._RWinRender = []
        this._RWinOrder = []
        this._RBottomBar = new winBBar();
    }

    addWin(winR){
        this._RWinRender.push(winR.getIsRendered());
        this._RWinOrder.push(this._RWinOrder.length);
        this._RWins.push(winR);
        this._RBottomBar.addWin(winR);
    }

    draw(ctx) {
        for (const i of this._RWinOrder) if (this._RWinRender[i]) this._RWins[i].draw(ctx);
        this._RBottomBar.draw(ctx);
    }

    grabContext(mPos, mState, mChange) {
        for (let k = this._RWinOrder.length - 1; k >= 0; k--) {
            const i = this._RWinOrder[k];
            if (this._RWinRender[i] && this._RWins[i].grabContext(mPos, mState, mChange)) {
                this._RWinOrder.splice(k, 1);
                this._RWinOrder.push(i);
                break;
            }
        }

        for (let i = 0; i < this._RWins.length; i++) {
            if (this._RWins[i].getRequiredAction()) {
                this._RWins[i].clearRequiredAction();
                this._RWinRender[i] = false;
            }
        }

        const idxOpen = this._RBottomBar.grabContext(mPos, mState, mChange);
        if (idxOpen >= 0) {
            this._RWinRender[idxOpen] = true;
            this._RWins[idxOpen].setIsRendered(true);
            const pos = this._RWinOrder.indexOf(idxOpen);
            if (pos >= 0) this._RWinOrder.splice(pos, 1);
            this._RWinOrder.push(idxOpen);
        }
    }
}

export {EX_winR, EX_winM};