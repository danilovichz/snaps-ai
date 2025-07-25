import { Icon } from '@chakra-ui/react';
import {
  MdFileCopy,
  MdHome,
  MdLock,
  MdLayers,
  MdAutoAwesome,
  MdOutlineManageAccounts,
  MdImage,
  MdOutlineCheckroom,
} from 'react-icons/md';
import { IoMdPerson } from 'react-icons/io';
import { LuHistory } from 'react-icons/lu';
import { RoundedChart } from '@/components/icons/Icons';

// Auth Imports
import { IRoute } from './types/navigation';

const routes: IRoute[] = [
  {
    name: 'nav.home',
    path: '/',
    icon: (
      <Icon as={MdImage} width="20px" height="20px" color="inherit" />
    ),
    collapse: false,
  },
  {
    name: 'nav.examples',
    path: '/examples',
    icon: <Icon as={MdAutoAwesome} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  {
    name: 'nav.virtualTryOn',
    path: '/virtual-tryon',
    icon: <Icon as={MdOutlineCheckroom} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  {
    name: 'nav.library',
    path: '/library',
    icon: <Icon as={MdLayers} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  {
    name: 'nav.history',
    path: '/history',
    icon: <Icon as={LuHistory} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  {
    name: 'nav.templates',
    path: '/templates',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  // --- Account & Settings ---
  {
    name: 'nav.account',
    path: '/account',
    icon: <Icon as={MdOutlineManageAccounts} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      {
        name: 'account.profile',
        layout: '/account',
        path: '/profile',
      },
      {
        name: 'account.billing',
        layout: '/account', 
        path: '/usage',
      },
      {
        name: 'account.settings',
        layout: '/account',
        path: '/api',
      },
    ],
  },

];

export default routes;
