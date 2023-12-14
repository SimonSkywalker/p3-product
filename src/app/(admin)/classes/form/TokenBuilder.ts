import NegativeNumberException from "@/app/(admin)/exceptions/NegativeNumberException";
import WrongTypeException from "@/app/(admin)/exceptions/WrongTypeException";
import Token from "./Token";

const tokenLength = 10;
const characters : String = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';


class TokenBuilder{
    private _tokens: Array<Token> = [];
    
    /**
     * Adds a number of new, unique random tokens to the token builder
     * @param amount Number of tokens to be created
     * @returns The token builder
     */
    private addTokens(amount:number) : TokenBuilder {
        let i = 0;
        while (i < amount) {
            let randomString : String = "";
            for(let j = 0; j < tokenLength; j++){
                randomString += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            //Check that no token has an ID identical to the random string
            if(!this._tokens.some((token) => {
                token.tokenID == randomString;
            })){
                //Only push the new token ID if it is unique.
                this._tokens.push(new Token(randomString));
                i++;
            }
        }
        return this;
    }

    /**
     * Invoke the splice method to remove a certain number of tokens at the end
     * @param amount The amount of tokens to be removed
     * @returns The token builder
     */
    private removeTokens(amount:number) : TokenBuilder {
        this._tokens.splice(this._tokens.length-amount, amount)
        return this;
    }

    /**
     * Invoke the addTokens and removeTokens methods to set the token number to a specific amount
     * @param amount The number of tokens that should be there at the end
     * @returns The token builder
     */
    public setTokens(amount: number): TokenBuilder{
        if(amount < 0){
            throw new NegativeNumberException;
        }
        if(this._tokens.length < amount)
            this.addTokens(amount - this._tokens.length);
        else if(this._tokens.length > amount)
            this.removeTokens(this._tokens.length - amount);
        return this;
    }

    /**
     * Used at the end of building to return the tokens
     * @returns The tokens that have been built
     */
    public getTokens() : Array<Token> {
        return this._tokens;
    }

    /**
     * Used to take an object array where every object has the same fields as a token
     * @param objects An array of objects that have _isUsed and _tokenID fields.
     * @returns The object array, now as complete Token objects.
     */
    public TokenFromObjects(objects : Array<any>) : Array<Token> {
        try {
            this.setTokens(objects.length);
            for(let i = 0; i < this._tokens.length; i++){
                if(objects[i]._tokenID == undefined || objects[i]._isUsed == undefined)
                    throw new WrongTypeException;
                this._tokens[i].tokenID = objects[i]._tokenID;
                this._tokens[i].isUsed = objects[i]._isUsed;
            }
            return this.getTokens();
        }
        catch (e: any){
            throw new WrongTypeException;
        }
    }
}

export default TokenBuilder;