// Screens
import HomeScreen from './views/Home';
import LeagueScreen from './views/League';
import ResearchScreen from './views/Research';
import GameListScreen from './views/GameList';
import GameScreen from './views/GamePage';
import BetScreen from './views/BetPage';
import LiveGame from './views/LiveGame';
import UpcomingEntries from './views/UpcomingEntries';
import DailyHomeScreen from './views/DailyHome';
import AuthScreen from './views/auth';
import { LiveEntries } from "./views/LiveEntries";
import { ArticlePage } from "./views/ArticlePage";

// Side Menu
import SideMenu from './components/SideMenu';
import {createDrawerNavigator} from 'react-navigation';

export default createDrawerNavigator({
  Auth: {
    screen: AuthScreen
  },
  Home: {
    screen: HomeScreen
  },
  League: {
    screen: LeagueScreen
  },
  DailyHome: {
    screen: DailyHomeScreen
  },
  Research: {
    screen: ResearchScreen
  },
  GameList: {
    screen: GameListScreen
  },
  Game: {
    screen: GameScreen
  },
  LiveGame: {
    screen: LiveGame
  },
  BetPage: {
    screen: BetScreen
  },
  UpcomingEntries: {
    screen: UpcomingEntries
  },
  LiveEntries: {
    screen: LiveEntries
  },
  ArticlePage: {
    screen: ArticlePage
  }
}, {
  contentComponent: SideMenu,
  drawerWidth: 300
});