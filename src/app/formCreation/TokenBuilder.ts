import Token from "./Token";

const tokenLength = 10;
const characters : String = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';


class TokenBuilder{
    private _tokens: Array<Token> = [];
    
    private addTokens(amount:number) : TokenBuilder {
        for(let i = 0; i < amount ; i++) {
            let randomString : String = "";
            for(let j = 0; j < tokenLength; j++){
                randomString += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            let newToken : Token = new Token(randomString);
            this._tokens.push(newToken);
        }
        return this;
    }

    private removeTokens(amount:number) : TokenBuilder {
        this._tokens.splice(this._tokens.length-amount, amount)
        return this;
    }

    public setTokens(amount: number): TokenBuilder{
        if(this._tokens.length < amount)
            this.addTokens(amount - this._tokens.length);
        else if(this._tokens.length > amount)
            this.removeTokens(this._tokens.length - amount);
        return this;
    }

    public getTokens() : Array<Token> {
        return this._tokens;
    }

    public TokenFromObjects(objects : Array<any>) : Array<Token> {
        this.setTokens(objects.length);
        for(let i = 0; i < this._tokens.length; i++){
            this._tokens[i].tokenID = objects[i]._tokenID;
            this._tokens[i].isUsed = objects[i]._isUsed;
        }
        return this.getTokens();
    }
}

export default TokenBuilder;