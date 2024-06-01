import { trigger, state, style, transition, animate } from '@angular/animations';

export const cardAnimations = [
  trigger('cardState', [
    state('inList', style({
      height: '*',
    })),
    state('expanded', style({
      height: '400px',
    })),
    transition('inList => expanded', animate('300ms ease-in')),
    transition('expanded => inList', animate('300ms ease-out'))
  ])
];

export const flyInAndOut =  [
  trigger('flyIn', [
    transition(':enter', [
      style({ transform : 'translateX(100vw)' }),
      animate('300ms ease-in', style({ transform : 'translateX(0vw)' }))
    ]),
    transition(':leave', [
      style({ transform : 'translateX(0vw)' }),
      animate('300ms ease-out', style({ transform : 'translateX(100vw)' }))
    ])
  ])
]
