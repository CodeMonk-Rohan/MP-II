
import "./ScreenWrapper.css"
import {motion} from "framer-motion"
import { childrenProp } from "../Card/Card"

export default function ScreenWrapper({children}:childrenProp){


    const variants = {
        hidden:{
            opacity:0,
            x:-250,
            y:200,
            scale:0.1, 
        },
        visible:{
            opacity:1,
            y:0,
            x:0,
            scale:1.5
        },
        exit:{
            opacity:1,
            x:-250,
            y:200,
            scale:0.1,
        }
    }

    return <motion.div className="screen-main"
    variants={variants}
    initial="hidden"
    animate="visible"
    transition={{
        duration:0.25,
        ease:"circIn",
        
    }}
    exit="exit"
    >

        {children}
    </motion.div>

    
}