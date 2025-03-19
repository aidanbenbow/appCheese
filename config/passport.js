import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { docClient, TABLE_NAME } from "./dynamoDB.js";
import { GetCommand } from "@aws-sdk/lib-dynamodb";



export default function configurePassport(passport){
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const params = {
                    TableName: TABLE_NAME,
                    Key: {
                        username: username,
                    },
                };
                const data = await docClient.send(new GetCommand(params));
                const user = data.Item;
                if (!user) {
                    return done(null, false, { message: "username not registered" });
                }
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Password incorrect" });
                }
            } catch (err) {
                return done(err);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.username);
    });

    passport.deserializeUser(async (username, done) => {
        try {
            const params = {
                TableName: TABLE_NAME,
                Key: {
                    username: username,
                },
            };
            const data = await docClient.send(new GetCommand(params));
            const user = data.Item;
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        } catch (err) {
            done(err);
        }
    });
}