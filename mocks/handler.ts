import {rest} from 'msw'
import { User } from '@/app/(admin)/classes/userClass';
import { loginFormSchema } from '@/app/(admin)/lib/validations/loginForm';
import userList from '@/app/(admin)/database/userLogins.json'
import { checkList } from '@/app/(admin)/classes/userClass';
import bcrypt from 'bcrypt';
const jwt = require("jsonwebtoken");
import FormBuilder from '@/app/(admin)/formCreation/FormBuilder';

export const handlers = [
    rest.post('/api/getFormdata', (req, res, ctx) => {
      //const selectedForm  = (await req.json())?.selectedForm as string;
      //const formObject =  new FormBuilder().formFromObject(selectForm)
       try{
      return res(
        ctx.json({formdata: {roles: ['role1','role2','role3'], selectedForm: "jes", 
        questions: [
          { _description: "Test af Multiple Choice (radio buttons)"},
          {_description: "Test af Multiple Choice (checkboxes)"},
          {_description: "Test af Slider (agreeDisagree)"}]}}),
        ctx.status(200))
      }catch(err){
        console.log(err);
        return res(ctx.status(500))
      } 
      
    }),
    rest.post('/api/getuser',async (req, res, ctx) => {
    const userId = 'Test2'
    const project = (await req.json()).replace(/(?<!\\)-/g," ").replace(/\\-/g,"-");
    const formslist = (await checkList.findForms(userId, project)).map((form: {_name: string }) => form._name);
    
    return res(ctx.json({Id: userId, forms: formslist}),ctx.status(200))
    }),
    rest.post('/api/login', async (req, res, ctx) =>{
    try{
        const { username, password } = loginFormSchema.parse(await req.json());
    
    // Your server-side logic here...
    let u:User = new User(username, password);
    let u2:User = new User("","");

    //Lists through users in the database and assigns
    //the user information if a match occurs
    userList.forEach((element: any)=>{
        if(element.Username === u.username){
            u2.username = element.Username
            u2.password = element.Password
        }
    });

    //Checks if the inputted password hash and database hash matches
    //Returns a boolean value
    let check = await bcrypt.compare(u.password,u2.password);
    
    
    if(check){     
      //Signs the token using Json Web Token. Expires after 24 hours
      const token = jwt.sign({ userId: u.username }, process.env.JWT_SECRET, {
        expiresIn: "24h",
        });

      
      return res(
        ctx.json({ token }),
        ctx.status(200),
      );
    } else {
      
      //Throws error if username or password hash does not match
      throw Error;
      
    }
    
  } catch (err: any) {

    //Returns JSON with error and status detailed
    return res(
      ctx.json({error:'Wrong Credentials'}),
      ctx.status(409)
    );
  }
    })
]