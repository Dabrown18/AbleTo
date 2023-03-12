import { lazy } from 'react';

/**
 * An important note about SVG usage in React Native:
 * Stroke/Fill overrides do not work well, so instead we strive to override the 'color' property of an SVG
 * When adding new SVGs this means that we want to set any stroke/fill of a path element that needs to be overriden
 * to equal 'currentColor'. If we want to preserve the original SVGs color, we can set the initial 'color' value of the SVG
 * to that hex, which will not prevent overrides.
 */
const Icons = {
    home: lazy(() => import('@src/assets/icons/home.svg')),
    homeFocused: lazy(() => import('@src/assets/icons/home-focused.svg')),
    explore: lazy(() => import('@src/assets/icons/explore.svg')),
    exploreFocused: lazy(() => import('@src/assets/icons/explore-focused.svg')),
    findCare: lazy(() => import('@src/assets/icons/find-care.svg')),
    findCareFocused: lazy(() => import('@src/assets/icons/find-care-focused.svg')),
    settings: lazy(() => import('@src/assets/icons/settings.svg')),
    settingsFocused: lazy(() => import('@src/assets/icons/settings-focused.svg')),
    ArrowRight: lazy(() => import('@src/assets/icons/ArrowRight.svg')),
    Plus: lazy(() => import('@src/assets/icons/Plus.svg')),
    Minus: lazy(() => import('@src/assets/icons/Minus.svg')),
    meditationIcon: lazy(() => import('@src/assets/icons/meditationIcon.svg')),
    breathingIcon: lazy(() => import('@src/assets/icons/breathingIcon.svg')),
    headsetIcon: lazy(() => import('@src/assets/icons/headsetIcon.svg')),
    wellBeingIcon: lazy(() => import('@src/assets/icons/wellBeingIcon.svg')),
    mood: lazy(() => import('@src/assets/icons/mood.svg')),
    favorite: lazy(() => import('@src/assets/icons/favorite.svg')),
    circleCheck: lazy(() => import('@src/assets/icons/circleCheck.svg')),
    Alcohol: lazy(() => import('@src/assets/icons/habits/alcohol.svg')),
    Caffeine: lazy(() => import('@src/assets/icons/habits/caffeine.svg')),
    Cannabis: lazy(() => import('@src/assets/icons/habits/cannabis.svg')),
    CustomHabit: lazy(() => import('@src/assets/icons/habits/custom.svg')),
    Eating: lazy(() => import('@src/assets/icons/habits/eating.svg')),
    Exercise: lazy(() => import('@src/assets/icons/habits/exercise.svg')),
    Family: lazy(() => import('@src/assets/icons/habits/family.svg')),
    Friends: lazy(() => import('@src/assets/icons/habits/friends.svg')),
    Hobbies: lazy(() => import('@src/assets/icons/habits/hobbies.svg')),
    Hygiene: lazy(() => import('@src/assets/icons/habits/hygiene.svg')),
    Medication: lazy(() => import('@src/assets/icons/habits/medication.svg')),
    Meditation: lazy(() => import('@src/assets/icons/habits/meditation.svg')),
    Nicotine: lazy(() => import('@src/assets/icons/habits/nicotine.svg')),
    Outdoors: lazy(() => import('@src/assets/icons/habits/outdoors.svg')),
    Pets: lazy(() => import('@src/assets/icons/habits/pets.svg')),
    Relationship: lazy(() => import('@src/assets/icons/habits/relationship.svg')),
    Sleep: lazy(() => import('@src/assets/icons/habits/sleep.svg')),
    Water: lazy(() => import('@src/assets/icons/habits/water.svg')),
    Note: lazy(() => import('@src/assets/icons/habits/note.svg')),
    note: lazy(() => import('@src/assets/icons/habits/note.svg')),
    noteIcon: lazy(() => import('@src/assets/icons/noteIcon.svg')),
    AddProgress: lazy(() => import('@src/assets/icons/habits/addProgress.svg')),
    Pencil: lazy(() => import('@src/assets/icons/habits/pencil.svg')),
    selectArrowDown: lazy(() => import('@src/assets/icons/selectArrowDown.svg')),
    volumeUp: lazy(() => import('@src/assets/icons/volumeUp.svg')),
    volumeUpOutlined: lazy(() => import('@src/assets/icons/volumeUp.svg')),
    newspaper: lazy(() => import('@src/assets/icons/newspaper.svg')),
    viewGrid: lazy(() => import('@src/assets/icons/viewGrid.svg')),
    collection: lazy(() => import('@src/assets/icons/collection.svg')),
    documentText: lazy(() => import('@src/assets/icons/documentText.svg')),
    film: lazy(() => import('@src/assets/icons/film.svg')),
    pencil: lazy(() => import('@src/assets/icons/pencil.svg')),
    pencilAlt: lazy(() => import('@src/assets/icons/pencilAlt.svg')),
    support: lazy(() => import('@src/assets/icons/support.svg')),
    chevronRight: lazy(() => import('@src/assets/icons/chevron-right.svg')),
    chevronRightBold: lazy(() => import('@src/assets/icons/chevron-right-bold.svg')),
    phoneIconTeal600: lazy(() => import('@src/assets/icons/phone.svg')),
    linkIconTeal600: lazy(() => import('@src/assets/icons/external-link.svg')),
    meditation: lazy(() => import('@src/assets/icons/meditation.svg')),
    breathing: lazy(() => import('@src/assets/icons/breathingIcon.svg')),
    dotsVertical: lazy(() => import('@src/assets/icons/dotsVertical.svg')),
    calendar: lazy(() => import('@src/assets/icons/calendar.svg')),
    heart: lazy(() => import('@src/assets/icons/heart.svg')),
    close: lazy(() => import('@src/assets/icons/close.svg')),
    heartOutline: lazy(() => import('@src/assets/icons/heartOutline.svg')),
    videoPlay: lazy(() => import('@src/assets/icons/video/play.svg')),
    videoPause: lazy(() => import('@src/assets/icons/video/pause.svg')),
    closedCaptions: lazy(() => import('@src/assets/icons/video/closedCaptions.svg')),
    closedCaptionsActive: lazy(() => import('@src/assets/icons/video/closedCaptionsActive.svg')),
    openFullscreen: lazy(() => import('@src/assets/icons/video/openFullscreen.svg')),
    closeFullscreen: lazy(() => import('@src/assets/icons/video/closeFullscreen.svg')),
    rewind: lazy(() => import('@src/assets/icons/video/rewind.svg')),
    fastForward: lazy(() => import('@src/assets/icons/video/fast-forward.svg')),
    storybook: lazy(() => import('@src/assets/icons/storybook.svg')),
    storyIcon: lazy(() => import('@src/assets/icons/storyIcon.svg')),
    trash: lazy(() => import('@src/assets/icons/habits/trash.svg')),
    user: lazy(() => import('@src/assets/icons/user.svg')),
    userFocused: lazy(() => import('@src/assets/icons/user-focused.svg')),
};

export type Icon = keyof typeof Icons;

export default Icons;
