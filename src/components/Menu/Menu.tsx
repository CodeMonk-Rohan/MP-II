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
      
      transition={{ duration: 0.3, delay: 0.2 }}
    >
    
        <Icon setter={setter} name="Browse"/>
        <Icon setter={setter} name="Player"/>
        <Icon setter={setter} name="Queue"/>
      
    </motion.div>
  );
}
