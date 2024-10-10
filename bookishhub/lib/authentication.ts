import {NextAuthOptions} from "next-auth"
import { databaseClient } from "./database"

export const authOptions: NextAuthOptions= {
    session: {
        strategy: 'jwt'
    }, 
    callbacks: {
        jwt: async ({token}) => {
            const user_database = await databaseClient.user.findFirst({
                where: { emailAddress: token.emailAddress
            }})
            if(user_database){
                token.uid = user_database.uid
                token.points = user_database.points
            }
        }
    }
}