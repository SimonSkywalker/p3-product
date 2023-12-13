

export class TokenValidator{
    
    public static async validateToken(token: any) : Promise<void> {
        
        await fetch("/api/protected", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        }).then((res)=>{
            if (!res.ok) throw new Error("Token validation failed");
        })
  
        
        
    }
}