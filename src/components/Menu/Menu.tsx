import "./Menu.css";
import { motion } from "framer-motion";
import Icon from "../Icon/Icon";


export type childFunc = {
  setter: Function
}

export default function Menu({setter}: childFunc) {
  return (
    <motion.div className="side-menu"
      initial={{ opacity: 0, y: 10, scale: 1}}
      animate={{ opacity: 1, y: 0, scale: 1}}
      
      transition={{ duration: 0.3, delay: 1 }}
    >
    
        <Icon setter={setter} name="player"/>
        <Icon setter={setter} name="settings"/>
        <Icon setter={setter} name=""/>
        <Icon setter={setter} name=""/>
      
    </motion.div>
  );
}
