// The Essential UI collection: the 10 categories and every icon name, exactly as specified.
// The build fails if a name here has no drawing, or a drawing has no name here.
import { ARROW_DEFS } from "./draw-arrows.mjs";
import { MOVE_DEFS } from "./draw-move.mjs";
import { ENTER_DEFS } from "./draw-enter.mjs";
import { VARIATION_DEFS } from "./draw-variations.mjs";
const list = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);

export const COLLECTION = { id: "essential-ui", name: "Essential UI" };

export const CATEGORIES = [
  {
    id: "navigation-direction",
    name: "Navigation & Direction",
    desc: "Arrows, chevrons and movement through an interface.",
    names: list(`Arrow Up, Arrow Down, Arrow Left, Arrow Right, Arrow Up Left, Arrow Up Right, Arrow Down Left, Arrow Down Right, Chevron Up, Chevron Down, Chevron Left, Chevron Right, Double Chevron Up, Double Chevron Down, Double Chevron Left, Double Chevron Right, Caret Up, Caret Down, Caret Left, Caret Right, Arrow Up Down, Arrow Left Right, Move, External Link, Expand, Collapse, Maximize, Minimize, Enter, Exit, Back, Forward, Undo, Redo, Refresh, Reload, Rotate, Switch, Shuffle, Sync`),
  },
  {
    id: "actions-controls",
    name: "Actions & Controls",
    desc: "Everyday actions and playback controls.",
    names: list(`Add, Remove, Close, Check, Check Circle, Check Square, Delete, Edit, Pencil, Copy, Duplicate, Cut, Paste, Save, Download, Upload, Share, Send, Import, Export, Print, Preview, View, Hide, Show, Lock, Unlock, Pin, Unpin, Bookmark, Flag, Star, Favorite, Like, Dislike, Reply, Forward Message, Reply All, Archive, Restore, Trash, Clear, Reset, Apply, Confirm, Cancel, Submit, Continue, Skip, Start, Stop, Pause, Play, Resume, Fast Forward, Rewind, More, More Horizontal, More Vertical, Menu`),
  },
  {
    id: "search-discovery",
    name: "Search & Discovery",
    desc: "Finding, filtering, sorting and tuning things.",
    names: list(`Search, Search Plus, Search Minus, Filter, Filter List, Funnel Classic, Funnel Rounded, Tapered Filter, Filter Sliders, Filter Sliders Vertical, Filter Lines, Sort Filter, Add Filter, Clear Filter, Filter Applied, Filter Off, Filter Active, Filter Square, Filter Circle, Funnel Solid, Filter Search, Smart Filter, Apply Filter, Sort, Sort Ascending, Sort Descending, Funnel, Sliders, Settings, Advanced Settings, Tune, Find, Zoom In, Zoom Out, Scan, Scan Search, Discover, Explore`),
  },
  {
    id: "interface-elements",
    name: "Interface Elements",
    desc: "Layouts, containers and page structure.",
    names: list(`Home, Dashboard, Grid, Grid View, List View, Table, Layout, Sidebar, Panel, Window, Browser Window, Modal, Popup, Drawer, Split View, Columns, Rows, Stack, Layers, Section, Container, Widget, Card, Feed, Sitemap, Breadcrumbs, Pagination, Page, Page Layout`),
  },
  {
    id: "status-feedback",
    name: "Status & Feedback",
    desc: "Alerts, progress, connectivity and system state.",
    names: list(`Info, Information Circle, Help, Help Circle, Warning, Alert, Error, Error Circle, Success Circle, Notification, Bell, Bell Off, Loading, Check Badge, Verified, Pending, Completed, Failed, Blocked, Disabled, Signal, Signal Low, Signal High, Battery, Battery Low, Battery Full, Wi-Fi, Wi-Fi Off, Cloud, Cloud Off, Sync Error, Update, New, Beta`),
  },
  {
    id: "input-form-controls",
    name: "Input & Form Controls",
    desc: "Fields, toggles, pickers and keyboard keys.",
    // "Switch" is already a Navigation icon, so the form control is called "Switch Control" to keep every name unique.
    names: list(`Checkbox, Checkbox Checked, Checkbox Indeterminate, Radio Button, Radio Button Selected, Toggle On, Toggle Off, Range Slider, Select, Password, Date Picker, Form, Keyboard, Command Key, Enter Key, Escape Key`),
  },
  {
    id: "account-user-interface",
    name: "Account & User Interface",
    desc: "People, sign-in and security.",
    names: list(`User, User Circle, User Square, User Plus, User Minus, User Check, User X, Users, Account, Profile, Login, Logout, Sign In, Sign Out, Register, Security, Shield, Shield Check, Privacy, Fingerprint, Face ID, Key, Authentication`),
  },
  {
    id: "text-editing",
    name: "Text & Editing",
    desc: "Formatting, lists and writing tools.",
    names: list(`Text, Text Cursor, Text Selection, Bold, Italic, Underline, Strikethrough, Align Left, Align Center, Align Right, Align Justify, Indent, Outdent, Bullet List, Numbered List, Checklist, Heading, Quote, Code, Link, Unlink, Superscript, Subscript, Spell Check, Grammar Check, Clear Formatting, Text Size, Font, Line Height, Letter Spacing`),
  },
  {
    id: "time-scheduling",
    name: "Time & Scheduling",
    desc: "Clocks, calendars and deadlines.",
    names: list(`Clock, History, Calendar, Calendar Check, Calendar X, Stopwatch, Timer, Hourglass, Alarm, Reminder`),
  },
  {
    id: "utility-miscellaneous",
    name: "Utility & Miscellaneous",
    desc: "Themes, media, gestures and accessibility.",
    names: list(`Light Mode, Dark Mode, System Theme, Sun, Moon, Brightness, Contrast, Palette, Eye, Eye Off, Fullscreen, Fullscreen Exit, Hand, Cursor, Pointer, Click, Touch, Drag, Drop, Focus, Accessibility, Accessibility Settings, Audio, Volume Off, Volume Low, Volume High, Microphone, Microphone Off, Camera, Camera Off, Video, Video Off, Screen Share, Screen Recording`),
  },
];

/** Extra search words for icons people look up by another name. */
export const SYNONYMS = {
  Trash: "bin garbage rubbish remove",
  Delete: "backspace erase",
  Edit: "write modify change",
  Pencil: "draw write",
  Download: "save arrow down",
  Upload: "arrow up",
  Settings: "gear cog preferences options",
  Search: "magnifier find lens",
  Home: "house main start",
  Menu: "hamburger navigation",
  "More Horizontal": "ellipsis dots overflow",
  "More Vertical": "ellipsis dots overflow kebab",
  More: "ellipsis dots overflow",
  Share: "social network",
  Send: "paper plane message",
  Like: "thumbs up",
  Dislike: "thumbs down",
  Favorite: "heart love",
  Notification: "alert badge",
  Bell: "ring alarm",
  Lock: "secure private padlock",
  Unlock: "open padlock",
  Eye: "visible watch",
  "Eye Off": "invisible hidden",
  Globe: "world web internet",
  Cloud: "storage weather",
  "Wi-Fi": "wireless network internet",
  Camera: "photo picture",
  Microphone: "mic voice record",
  Video: "film movie",
  Calendar: "date schedule month",
  Clock: "time hour watch",
  Stopwatch: "timer race",
  Hourglass: "wait loading time",
  Palette: "color paint theme",
  Moon: "night dark",
  Sun: "day light",
  Link: "url hyperlink chain",
  Code: "developer programming brackets",
  User: "person profile avatar",
  Users: "people group team",
  Key: "password access",
  Shield: "protect security",
  Fingerprint: "biometric touch id",
  "Face ID": "biometric face recognition",
  Focus: "target aim center viewfinder",
  Translate: "language localise",
  Accessibility: "a11y inclusive",
  Refresh: "reload update sync",
  Reload: "refresh again",
  Shuffle: "random mix",
  Undo: "revert back",
  Redo: "repeat forward",
  Grid: "tiles squares",
  Layers: "stack levels",
  Dashboard: "overview analytics",
  Filter: "funnel narrow",
  Funnel: "filter narrow",
  Sort: "order arrange",
  Info: "information about",
  Help: "support question",
  Warning: "caution danger triangle",
  Error: "problem fail stop",
  Success: "done complete ok",
  Loading: "wait progress busy",
  Spinner: "loading wait busy",
  Battery: "power charge",
  Signal: "radio broadcast antenna",
  Bold: "strong heavy",
  Italic: "emphasis slanted",
  Underline: "line under",
  Heading: "title h1",
  Quote: "blockquote citation",
  Checkbox: "tick square",
  Toggle: "switch on off",
  Slider: "range volume",
  Keyboard: "typing keys",
  Print: "printer paper",
  Copy: "clipboard duplicate",
  Paste: "clipboard",
  Cut: "scissors",
  Save: "disk floppy",
  Archive: "box store",
  Bookmark: "save later ribbon",
  Flag: "report mark",
  Star: "rating favourite",
  Pin: "attach thumbtack",
  Fullscreen: "expand screen",
  Hand: "palm stop",
  Cursor: "mouse arrow pointer",
  Pointer: "finger click",
  Drag: "grip handle move",
  Barcode: "scan product",
  Audio: "sound wave music",
  Volume: "speaker sound",
  "Screen Share": "present cast",
  "Screen Recording": "capture record",
};

// The arrow designs are not a browsable category: they carry `hidden` and the library lists them only when someone searches.
// A name that another icon already uses gets " Arrow" added.
const taken = new Set(CATEGORIES.flatMap((c) => c.names));
export const ARROWS = ARROW_DEFS.map(([label, parts, words]) => ({ name: taken.has(label) ? `${label} Arrow` : label, parts, words }));
CATEGORIES.push({ id: "arrows", name: "Arrows", desc: "Arrow designs, found through search.", hidden: true, names: ARROWS.map((a) => a.name) });
for (const a of ARROWS) SYNONYMS[a.name] = `arrow arrows ${a.words}`;

const takenNow = new Set(CATEGORIES.flatMap((c) => c.names));
export const MOVES = MOVE_DEFS.map(([label, parts, words]) => ({ name: takenNow.has(label) ? (label.startsWith("Move") ? `${label} Icon` : `${label} (Move)`) : label, parts, words }));
CATEGORIES.push({ id: "move", name: "Move", desc: "Move designs, found through search.", hidden: true, names: MOVES.map((a) => a.name) });
for (const a of MOVES) SYNONYMS[a.name] = `move moving arrow arrows ${a.words}`;

const takenMore = new Set(CATEGORIES.flatMap((c) => c.names));
export const ENTERS = ENTER_DEFS.map(([label, parts, words]) => ({ name: takenMore.has(label) ? (label.startsWith("Enter") ? `${label} Icon` : `${label} (Enter)`) : label, parts, words }));
CATEGORIES.push({ id: "enter", name: "Enter", desc: "Enter designs, found through search.", hidden: true, names: ENTERS.map((a) => a.name) });
for (const a of ENTERS) SYNONYMS[a.name] = `enter entering arrow arrows ${a.words}`;

// Icon variations: ten browsable sets of alternative designs (the two extra funnels join Search & Discovery).
const VARIATION_SETS = {
  Search: ["Search Variations", "Alternative takes on search.", "search find magnify lens zoom"],
  Settings: ["Settings Variations", "Alternative takes on settings.", "settings gear cog preferences options config"],
  Notification: ["Notification Variations", "Alternative takes on notifications.", "notification notify bell alert alarm"],
  Edit: ["Edit Variations", "Alternative takes on editing.", "edit pencil pen write compose"],
  Delete: ["Delete Variations", "Alternative takes on deleting.", "delete remove trash bin discard"],
  Download: ["Download Variations", "Alternative takes on downloading.", "download save get arrow down"],
  Upload: ["Upload Variations", "Alternative takes on uploading.", "upload send publish arrow up"],
  Share: ["Share Variations", "Alternative takes on sharing.", "share send social network"],
  Favorite: ["Favorite Variations", "Alternative takes on favorites.", "favorite favourite like star heart love bookmark"],
};
const takenVar = new Set(CATEGORIES.flatMap((c) => c.names));
export const VARIATIONS = VARIATION_DEFS.map(([set, name, parts]) => {
  if (takenVar.has(name)) throw new Error(`variation name already used: ${name}`);
  return { set, name, parts };
});
for (const [set, [name, desc, words]] of Object.entries(VARIATION_SETS)) {
  const mine = VARIATIONS.filter((v) => v.set === set);
  CATEGORIES.push({ id: `${set.toLowerCase()}-variations`, name, desc, names: mine.map((v) => v.name) });
  for (const v of mine) SYNONYMS[v.name] = words;
}
const filterExtra = VARIATIONS.filter((v) => v.set === "Filter");
CATEGORIES.find((c) => c.id === "search-discovery").names.push(...filterExtra.map((v) => v.name));
for (const v of filterExtra) SYNONYMS[v.name] = "filter funnel narrow";
