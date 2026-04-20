import { Tour } from 'nextstepjs';

const steps : Tour[] = [
  {
    tour: "tutorial",
    steps: [
      // Welcome
      {
        icon: null,
        title: "Welcome to FIVE!",
        content: <><p>Welcome! It's great to have you!</p><p className='italic text-xs mt-4 mb-4'>Already know FIVE? You can skip the tutorial at any time (:</p></>,
        showControls: true,
        showSkip: true,
      },
      // Metrics
      {
        icon: null,
        title: "Meet the Metrics: MIND!",
        content: <p><span className="font-extrabold text-mind">MIND</span> tracks your mental health</p>,
        selector: '.metric-card-mind',
        showControls: true,
        showSkip: true,
        side: 'top-left',
        pointerPadding: 12,
        disableInteraction: true,
      },
      {
        icon: null,
        title: "Meet the Metrics: BODY!",
        content: <p><span className="font-extrabold text-body">BODY</span> tracks your physical health</p>,
        selector: '.metric-card-body',
        showControls: true,
        showSkip: true,
        side: 'top',
        pointerPadding: 12,
        disableInteraction: true,
      },
      {
        icon: null,
        title: "Meet the Metrics: CASH!",
        content: <p><span className="font-extrabold text-cash">CASH</span> tracks your financial health</p>,
        selector: '.metric-card-cash',
        showControls: true,
        showSkip: true,
        side: 'top-right',
        pointerPadding: 12,
        disableInteraction: true,
      },
      {
        icon: null,
        title: "Meet the Metrics: WORK!",
        content: <p><span className="font-extrabold text-work">WORK</span> tracks your academic/career health</p>,
        selector: '.metric-card-work',
        showControls: true,
        showSkip: true,
        side: 'top-left',
        pointerPadding: 12,
        disableInteraction: true,
      },
      {
        icon: null,
        title: "Meet the Metrics: BOND!",
        content: <p><span className="font-extrabold text-bond">BOND</span> tracks your social/familial health</p>,
        selector: '.metric-card-bond',
        showControls: true,
        showSkip: true,
        side: 'top',
        pointerPadding: 12,
        disableInteraction: true,
        nextRoute: '/track',
      },
      // Track Action
      {
        icon: null,
        title: "Tracking Page",
        content: <><p>Here you can log your actions.</p><p className='mt-4'>Nights out, home cooking, thrifty saving; it can all be tracked here.</p></>,
        showControls: true,
        showSkip: true,
        disableInteraction: true,
        selector: '#track-title',
        pointerPadding: 12,
        side: 'bottom',
        prevRoute: '/'
      },
      {
        icon: null,
        title: "Filtering Actions",
        content: <><p>Here you can filter your actions...</p></>,
        showControls: true,
        showSkip: true,
        disableInteraction: true,
        selector: '#track-filters',
        pointerPadding: 12,
        side: 'bottom',
        prevRoute: '/'
      },
      {
        icon: null,
        title: "Log an action",
        content: 'Below is an "Action". This represents something you did.',
        showControls: true,
        showSkip: true,
        selector: '#track-list .track-card:first-child',
        disableInteraction: true,
        pointerPadding: 18,
        side: 'top',
      },
      {
        icon: null,
        title: "Log an action",
        content: "You can tap here to log an action. Try it out!",
        showControls: true,
        showSkip: true,
        selector: '#track-list .track-card:first-child button:nth-child(2)',
        pointerPadding: 12,
        side: 'top-right',
      },
      {
        icon: null,
        title: "Log an action",
        content: "You can also tap here to add notes or change the time you did an action",
        showControls: true,
        showSkip: true,
        selector: '#track-list .track-card:first-child button:nth-child(1)',
        side: 'top-right',
        pointerPadding: 12,
        disableInteraction: true,
        nextRoute: '/',
      },
      // See Action Log on Homepage
      {
        icon: null,
        title: "Action Log",
        content: "Here you can see all your past actions (well, pretty much all!)",
        showControls: true,
        showSkip: true,
        selector: '#action-list',
        side: 'top',
        prevRoute: '/track',
      },
      // End Tour
      {
        icon: null,
        title: "That's It!",
        content: <><p>That covers the basics, if you have any issues you can always raise them over on <a href="https://github.com/glennhs/five/issues">my GitHub</a>! Hope you enjoy and take care of yourself!</p><p>- Glenn</p></>,
        showControls: true,
        showSkip: true,
      },
    ]
  }
];

export default steps