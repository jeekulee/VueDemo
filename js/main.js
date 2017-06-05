import dragula from "dragula";
import "css/dragula.css";
import MainMenu from "./dashboard/mainMenu";
import FavourMenu from "./dashboard/favourMenu";


//拖拽控件初始化
const tabframe = $('#commonTab').bootstrapDynamicTabs();



//常用菜单
const myFavourMenu = new FavourMenu();
const mainMenu = new MainMenu(tabframe,myFavourMenu);
mainMenu.initMenu();