import "./Menu.css";
import { motion } from "framer-motion";
import Icon from "../Icon/Icon";
import browseButton from '../../assets/list-music (2).svg'
import settingsButton from '../../assets/settings-sliders.svg'
import playerButton from "../../assets/waveform.svg"

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
    
        <Icon setter={setter} name="Browse" iconFile={browseButton}/>
        <Icon setter={setter} name="Player" iconFile={playerButton}/>
        <Icon setter={setter} name="Queue" iconFile={settingsButton}/>
      
    </motion.div>
  );
}
