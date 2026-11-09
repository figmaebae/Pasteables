// The 100 enter designs. Like the arrows and the move set, they are not a browsable category: the library lists them only when someone searches.
// Hand drawn on the 24 x 24 grid with one shared line weight, a glyph on the left (x 2-15) and a small arrow on the right.
import { S as S0, F, circ, rect, xf, gear, dash } from "./dsl.mjs";

const W = 1.5;
const S = (d, w = W) => S0(d, w);
const fx = (d) => xf(d, { flipX: true });
const s = (d) => [S(d)];
const dashed = (d) => S0(d, W, dash);
const dot = (x, y, r = 1) => F(circ(x, y, r));
/** the shared arrow: a shaft from x to the right edge and a head at (22, y) */
const A = (x = 15, y = 12) => S(`M${x} ${y}H22M19.5 ${y - 2.5}L22 ${y}l-2.5 2.5`);
const head = (x, y, r = 3.4) => circ(x, y, r);
const shoulders = (x, y, w = 5.5) => `M${x - w} ${y}a${w} ${w} 0 0 1 ${2 * w} 0`;
const BRACKET = "M14.5 4H18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3.5";
const CORNERS = "M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2";
const WALK = "M9 8.5l-1.5 4.5 3 2.5.5 4.5M7.5 13L4.5 15M9.2 9l3 1.5";
const DB = "M3 5.5c0-1.4 2.7-2.5 6-2.5s6 1.1 6 2.5-2.7 2.5-6 2.5S3 6.9 3 5.5ZM3 5.5v13c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-13M3 12c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5";
const DOC = "M12 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6M12 3l4 4v2M12 3v4h4";
const FOLDER = "M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v1M3 7v10a2 2 0 0 0 2 2h7";
const SHIELD = "M9 3l6 2.5v5c0 4-3 7-6 8.5-3-1.5-6-4.5-6-8.5v-5Z";
const BUBBLE = "M3 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8l-3 3v-3a2 2 0 0 1-2-2Z";
const PLAY = "M7.5 9.5v5l4.5-2.5Z";
const field = () => S(rect(2, 8, 13, 8, 2.5));

export const ENTER_DEFS = [
  ["Enter", [S(rect(12.5, 3.5, 8, 17, 2)), S("M3 12h9.5M8.5 8.5L12 12l-3.5 3.5")], "login sign in arrow door"],
  ["Login", s("M14 3.5h4.5A1.5 1.5 0 0 1 20 5v14a1.5 1.5 0 0 1-1.5 1.5H14M3 12h11M10 8.5l3.5 3.5-3.5 3.5"), "sign in arrow door"],
  ["Sign In", [S(head(8.5, 8)), S(shoulders(8.5, 20)), A(16, 14)], "login person user arrow"],
  ["Access", [S(rect(2.5, 11, 11, 9.5, 2)), S("M5 11V7.5a3 3 0 0 1 5.5-1.7"), A(16, 16)], "unlock open arrow permission"],
  ["Open", s("M12 4.5L5 6.5v13l7-2ZM12 4.5l7 2v13l-7-2ZM12 4.5v13"), "door double book"],
  ["Go In", [S("M3 12h10M9.5 8.5L13 12l-3.5 3.5"), S("M16 4h2.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H16")], "arrow door inside"],
  ["Enter Door", [S(rect(7.5, 3.5, 9, 17, 2)), dot(13.5, 12, 0.9)], "door knob entrance"],
  ["Enter Room", [S("M2.5 12h9M8 8.5l3.5 3.5L8 15.5"), S(rect(13, 4, 8, 16, 2))], "arrow door room"],
  ["Step In", [F(circ(7, 5, 1.5)), S(WALK), S(BRACKET)], "walk person door"],
  ["Walk In", [F(circ(17, 5, 1.5)), S(fx(WALK)), S(fx(BRACKET))], "walk person door"],
  ["Log In (User)", [S(head(7, 10, 2.2)), S("M3 17.5a4 4 0 0 1 8 0"), S("M14 5.5h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-3")], "login user person door"],
  ["Enter Account", [S(head(8.5, 8, 3.5)), S(shoulders(8.5, 20, 6)), A(16, 14)], "login user person arrow"],
  ["Enter System", [S(rect(2.5, 4, 14, 11, 2)), S("M7 20h5M9.5 15v5M6.5 9.5h7M11 7l2.5 2.5L11 12"), A(19, 12)], "computer monitor arrow"],
  ["Enter App", [S(rect(4.5, 2.5, 9, 19, 2)), S("M10 12h12M19.5 9.5L22 12l-2.5 2.5")], "phone mobile arrow"],
  ["Enter Web", [S(rect(2.5, 5, 17, 14, 2)), S("M2.5 9h17M7 14h8M12.5 11.5L15 14l-2.5 2.5")], "browser window arrow site"],
  ["Enter Link", [S("M8 14a3 3 0 0 0 4.2 0l2-2a3 3 0 0 0-4.2-4.2l-.6.6M10 10a3 3 0 0 0-4.2 0l-2 2a3 3 0 0 0 4.2 4.2l.6-.6"), A(16, 12)], "chain url arrow"],
  ["Enter Site", [S(`${circ(9.5, 12, 7)}M2.5 12h14M9.5 5c-2.4 2.4-2.4 11.6 0 14M9.5 5c2.4 2.4 2.4 11.6 0 14`), A(17, 12)], "globe world web arrow"],
  ["Enter Portal", [S(rect(2.5, 7, 11, 13, 2)), S("M6 7V5.5A1.5 1.5 0 0 1 7.5 4H16a1.5 1.5 0 0 1 1.5 1.5V9"), A(13.5, 13.5)], "gateway door arrow"],
  ["Enter Workspace", [S("M5 6h12a1 1 0 0 1 1 1v8H4V7a1 1 0 0 1 1-1ZM2.5 18.5h17M8.5 10.5h5M11.5 8.5l2 2-2 2")], "laptop work arrow"],
  ["Enter Dashboard", [S(rect(2.5, 3.5, 7, 7, 1.5)), S(rect(13.5, 3.5, 7, 7, 1.5)), S(rect(2.5, 13.5, 7, 7, 1.5)), S("M13.5 17h7.5M18.5 14.5L21 17l-2.5 2.5")], "grid panels arrow"],
  ["Enter PIN", [field(), S("M5.8 12h.01M8.5 12h.01M11.2 12h.01", 2.2), A(15)], "code passcode dots"],
  ["Enter Code", [S(rect(3, 3.5, 18, 17, 2.5)), S("M9 9.5L6.5 12 9 14.5M15 9.5l2.5 2.5-2.5 2.5M13 8.5l-2 7")], "developer source brackets"],
  ["Enter Key", [S(circ(6, 8.5, 3)), S("M8.2 10.7L16 18.5M13 15.5l2-2"), A(15, 6.5)], "key arrow security"],
  ["Enter Password", [S(rect(2, 7.5, 14, 9, 2.5)), S("M5.4 10.6v2.8M4.2 11.3l2.4 1.4M6.6 11.3l-2.4 1.4M9.3 10.6v2.8M8.1 11.3l2.4 1.4M10.5 11.3l-2.4 1.4M13.2 10.6v2.8M12 11.3l2.4 1.4M14.4 11.3L12 12.7", 1.1), A(16)], "stars hidden dots secret"],
  ["Enter OTP", [S(rect(2, 7, 14, 10, 2.5)), S("M5.4 10.3l1.2-.6v4.6M8.6 10.9a1.3 1.3 0 0 1 2.5.2c0 1-2.5 1.7-2.5 2.9h2.6M11.8 10.4h2.4l-1.2 1.6a1.4 1.4 0 1 1-1.3 2.1", 1.1), A(16)], "one time code digits"],
  ["Enter Text", [S(rect(3, 5, 12, 14, 2.5)), S("M7.5 8.5h3M9 8.5v7M7.5 15.5h3"), A(15)], "type input cursor"],
  ["Enter Data", [S(DB), A(15.5)], "database table arrow"],
  ["Enter Details", [S("M12 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6M12 3l4 4v2M12 3v4h4M8 10h4M8 13.5h3M8 17h3"), S("M13 16.5h9M19.5 14l2.5 2.5-2.5 2.5")], "document lines info arrow"],
  ["Input", [S(rect(3, 6, 12, 12, 2.5)), S("M7.5 9.5h3M9 9.5v5M7.5 14.5h3"), A(15)], "type field cursor"],
  ["Submit", s("M3 11l18-8-8 18-2-8Z"), "send plane arrow"],
  ["Confirm & Enter", [S(rect(2.5, 5, 12.5, 14, 2.5)), S("M6 12l2.5 2.5 4-4.5"), A(15)], "check tick approve arrow"],
  ["Verify & Enter", [S(SHIELD), S("M6 11l2.2 2.2 3.8-4"), A(16)], "shield check secure"],
  ["Authenticate", [S("M3.5 15v-3.5a6 6 0 0 1 12 0V14M6.5 18.5v-7a3 3 0 0 1 6 0v5M9.5 11.5v9"), A(16.5, 14)], "fingerprint touch id biometric"],
  ["Secure Enter", [S(rect(2.5, 11, 11, 9.5, 2)), S("M5 11V8a3 3 0 0 1 6 0v3"), A(16, 16)], "lock safe arrow"],
  ["Biometric Enter", [S("M3 8V6a2 2 0 0 1 2-2h2M17 4h2a2 2 0 0 1 2 2v2M21 16v2a2 2 0 0 1-2 2h-2M7 20H5a2 2 0 0 1-2-2v-2"), S("M8 15v-2.5a4 4 0 0 1 8 0V15M10 17.5v-5a2 2 0 0 1 4 0v3.5M12 12.5v6")], "fingerprint scan corners"],
  ["Face Enter", [S(CORNERS), S("M9 10.5v1M15 10.5v1M9 15c.8 1 1.8 1.5 3 1.5s2.2-.5 3-1.5")], "face id scan smile"],
  ["Scan & Enter", [S(rect(3, 3, 6, 6, 1)), S(rect(3, 13, 6, 6, 1)), S(rect(13, 3, 6, 6, 1)), S("M12 13h3v3h-3ZM15 18h7M19.5 15.5L22 18l-2.5 2.5")], "qr code arrow"],
  ["Enter with ID", [S(rect(2, 6, 12.5, 12, 2)), S(circ(5.8, 10.2, 1.3)), S("M3.8 15a2 2 0 0 1 4 0M9.5 10h2M9.5 13.5h2"), A(14.5)], "card badge identity"],
  ["Keycard Enter", [S(rect(2, 7, 13, 10, 2)), S("M2 10.5h13"), A(15, 13.5)], "card access swipe"],
  ["Tap to Enter", [S("M4 9a4 4 0 0 1 0 6M7.5 7a7 7 0 0 1 0 10M11 5a10 10 0 0 1 0 14"), A(14.5)], "nfc contactless wireless"],
  ["Open & Enter", [S("M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6"), S("M9 12h12.5M18 8.5l3.5 3.5-3.5 3.5")], "door open arrow"],
  ["Enter Building", [S("M4 21V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v15M2.5 21h11M7 9h2M7 12.5h2M7 16h2"), A(15)], "office tower arrow"],
  ["Enter Location", [S("M9 20s-5.5-4.5-5.5-9a5.5 5.5 0 0 1 11 0c0 4.5-5.5 9-5.5 9Z"), S(circ(9, 11, 2)), A(16)], "pin map place arrow"],
  ["Enter Space", [S("M8 3l6 3.5v7L8 17l-6-3.5v-7ZM8 10l6-3.5M8 10L2 6.5M8 10v7"), A(16, 10)], "cube box 3d arrow"],
  ["Enter Area", [dashed(rect(3, 5, 12, 14, 2)), S("M13 12h9M19.5 9.5L22 12l-2.5 2.5")], "dashed zone arrow"],
  ["Enter Zone", [S(CORNERS), S("M8 12h8M13 9l3 3-3 3")], "frame corners arrow"],
  ["Enter Ticket", [S("M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1.3a1.8 1.8 0 0 0 0 3.6V16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.3a1.8 1.8 0 0 0 0-3.6Z"), S("M9 7.5v1M9 11.5v1M9 15.5v1"), A(15.5)], "pass admission event"],
  ["Enter Event", [S(rect(3, 5, 12, 15, 2)), S("M3 10h12M7 3v4M11 3v4"), A(15, 15)], "calendar date arrow"],
  ["Enter Queue", [S(circ(8, 7.5, 3)), S("M2.5 18a5.5 5.5 0 0 1 11 0"), S("M14.5 5.2a2.7 2.7 0 0 1 0 5.2"), A(15, 17.5)], "people line waiting"],
  ["Join & Enter", [S(head(9, 8, 3.5)), S(shoulders(9, 20, 6)), S("M19 8v6M16 11h6")], "plus add person user"],
  ["Enter Chat", [S("M3 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8l-3 3v-3a2 2 0 0 1-2-2Z"), S("M6.5 9h.01M9 9h.01M11.5 9h.01", 2), A(16.5, 9)], "message talk bubble"],
  ["Enter Call", [S("M5 4h3l2 5-2.5 1.5a10 10 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2Z"), S("M15 6h7M19.5 3.5L22 6l-2.5 2.5")], "phone ring arrow"],
  ["Enter Meeting", [S(rect(2, 7, 10, 10, 2)), S("M12 10.5l3.5-2v7l-3.5-2"), A(18)], "video camera conference"],
  ["Enter Room (Call)", [S(rect(2, 5, 13, 14, 3)), S("M6 10.5h4v3H6ZM10 11.5l2-1v3l-2-1"), A(15)], "video call room"],
  ["Enter Live", [dot(12, 12, 1.6), S("M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.5 5.5a9 9 0 0 0 0 13M18.5 5.5a9 9 0 0 1 0 13")], "broadcast radio signal"],
  ["Enter Stream", [S(rect(2, 5, 13, 14, 2.5)), S(PLAY), A(15)], "play video watch"],
  ["Enter Channel", [dot(12, 11, 1.6), S("M8 7.5a5.5 5.5 0 0 0 0 7M16 7.5a5.5 5.5 0 0 1 0 7M5 5a9.5 9.5 0 0 0 0 12M19 5a9.5 9.5 0 0 1 0 12M12 13v7")], "antenna broadcast"],
  ["Enter Group", [S(head(9, 8, 3.5)), S(shoulders(9, 20, 6)), A(16, 14)], "people team arrow"],
  ["Enter Forum", [S("M3 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7l-3 3v-3a2 2 0 0 1-1-2Z"), S("M6.5 9h.01M9 9h.01M11.5 9h.01", 2), A(16.5, 9)], "discussion thread"],
  ["Enter Community", [S(circ(9, 6.5, 2)), S(circ(4, 10.5, 1.7)), S(circ(14, 10.5, 1.7)), S("M5.5 16a3.5 3.5 0 0 1 7 0"), A(14, 17)], "people group social"],
  ["Enter Document", [S(DOC), S("M12 15h10M19.5 12.5L22 15l-2.5 2.5")], "file page arrow"],
  ["Enter Folder", [S(FOLDER), S("M12 15h10M19.5 12.5L22 15l-2.5 2.5")], "directory arrow"],
  ["Enter File", [S("M12 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5M12 3l5 5v3M12 3v5h5"), S("M12 16h10M19.5 13.5L22 16l-2.5 2.5")], "document page arrow"],
  ["Enter Drive", [S("M3 14l2.5-6a2 2 0 0 1 1.9-1.4h4.2a2 2 0 0 1 1.9 1.4L16 14v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2ZM3 14h13M12 16.5h.01"), A(16, 14)], "disk storage arrow"],
  ["Enter Cloud", [S("M5.5 17.5A3.7 3.7 0 0 1 5 10.2a5.5 5.5 0 0 1 10.4-1A4 4 0 0 1 15 17.5Z"), A(16, 13.5)], "storage online arrow"],
  ["Enter Storage", [S(DB), A(15.5)], "database disk arrow"],
  ["Enter Library", [S(rect(2.5, 4, 3, 16, 0.8)), S(rect(6.5, 4, 3, 16, 0.8)), S("M10.8 5.5l2.7-.7 3 14-2.7.7Z"), A(17)], "books shelf arrow"],
  ["Enter Collection", [S("M9 4l7 3.5-7 3.5-7-3.5ZM2 12l7 3.5 7-3.5M2 15.5L9 19l7-3.5"), A(17)], "layers stack arrow"],
  ["Enter Archive", [S("M3 6h13v3H3ZM4.5 9v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9M8 13h4"), A(17, 14)], "box store arrow"],
  ["Enter History", s("M12 7v5l3 2M3.5 12a8.5 8.5 0 1 0 2.5-6M3.5 4v4h4"), "clock past undo"],
  ["Enter Settings", [S(gear(8.5, 12, 8, 6.5, 5)), S(circ(8.5, 12, 2)), A(16)], "gear cog arrow"],
  ["Enter Profile", [S(circ(9.5, 12, 7.5)), S(head(9.5, 10, 2.2)), S("M5.3 17a4.5 4.5 0 0 1 8.4 0"), A(17)], "user avatar arrow"],
  ["Enter Edit", [S("M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4"), S("M7.5 15l.8-3 6.7-6.7a1.4 1.4 0 0 1 2 2L10.5 14Z"), A(18, 17)], "pencil write square"],
  ["Enter Mode", [S(rect(2, 8.5, 13, 7, 3.5)), dot(11.5, 12, 1.4), A(15)], "toggle switch arrow"],
  ["Enter Fullscreen", [S("M3 9V5a1 1 0 0 1 1-1h4M11 4h4a1 1 0 0 1 1 1v4M16 15v4a1 1 0 0 1-1 1h-4M8 20H4a1 1 0 0 1-1-1v-4"), A(16)], "expand corners arrow"],
  ["Enter Focus", [S("M3 9V5a1 1 0 0 1 1-1h4M11 4h4a1 1 0 0 1 1 1v4M16 15v4a1 1 0 0 1-1 1h-4M8 20H4a1 1 0 0 1-1-1v-4"), dot(9.5, 12, 1.8), A(17)], "target dot corners"],
  ["Enter View", [S("M2 12s2.8-5.2 6.5-5.2 6.5 5.2 6.5 5.2-2.8 5.2-6.5 5.2S2 12 2 12Z"), S(circ(8.5, 12, 2)), A(15)], "eye look arrow"],
  ["Enter Preview", [S(rect(2, 5.5, 13, 13, 2.5)), S(PLAY), A(15)], "play screen arrow"],
  ["Enter Compare", [S(rect(2, 5, 13, 14, 2)), S("M8.5 5v14"), A(15)], "split panes arrow"],
  ["Enter Layout", [S(rect(2.5, 4, 12.5, 16, 2)), S("M8.8 4v16M2.5 12h6.3"), A(15)], "panels grid arrow"],
  ["Enter Network", [S("M2 9.5a11 11 0 0 1 14 0M4.5 12.5a7.5 7.5 0 0 1 9 0M7 15.5a3.5 3.5 0 0 1 4 0"), dot(9, 18.8, 1.1), A(17, 14)], "wifi signal arrow"],
  ["Enter VPN", [S(SHIELD), S("M9 8.5v3.5"), dot(9, 7.5, 0.9), A(16)], "shield private arrow"],
  ["Enter Server", [S(rect(2.5, 4, 12.5, 6, 1.5)), S(rect(2.5, 14, 12.5, 6, 1.5)), S("M6 7h.01M6 17h.01"), A(15)], "rack host arrow"],
  ["Enter Database", [S(DB), A(15.5)], "data store arrow"],
  ["Enter Code Editor", [S(rect(2, 5, 13, 14, 2.5)), S("M6.5 10.5l-2 1.5 2 1.5M10.5 10.5l2 1.5-2 1.5M8.6 10l-.9 4"), A(15)], "ide developer arrow"],
  ["Enter Terminal", [S(rect(2, 5, 13, 14, 2.5)), S("M5.5 10l2.5 2-2.5 2M9.5 14.5h2.5"), A(15)], "console shell command"],
  ["Enter Console", [S(rect(2, 5, 13, 14, 2.5)), S("M2 9h13"), dot(4.3, 7, 0.5), dot(6.1, 7, 0.5), dot(7.9, 7, 0.5), S("M6.6 11.5L5 13.5l1.6 2M10.4 11.5l1.6 2-1.6 2M8.8 11.2l-.6 4.6"), A(15, 12)], "debug window code"],
  ["Enter API", [S("M6 4a3 3 0 0 0-3 3v2a2 2 0 0 1-2 2 2 2 0 0 1 2 2v2a3 3 0 0 0 3 3M10 4a3 3 0 0 1 3 3v2a2 2 0 0 0 2 2 2 2 0 0 0-2 2v2a3 3 0 0 1-3 3"), A(16)], "braces developer endpoint"],
  ["Enter Integration", [S("M8 4a2 2 0 1 1 4 0h2.5a1 1 0 0 1 1 1v2.5a2 2 0 1 1 0 4V14a1 1 0 0 1-1 1H12a2 2 0 1 0-4 0H5.5a1 1 0 0 1-1-1v-2.5a2 2 0 1 0 0-4V5a1 1 0 0 1 1-1Z"), A(17, 10)], "plugin puzzle connect"],
  ["Enter Flow", [S(rect(7, 3, 5, 4, 1)), S(rect(2, 15, 5, 4, 1)), S(rect(12, 15, 5, 4, 1)), S("M9.5 7v4M4.5 15v-4h10v4"), A(17.5, 17)], "diagram workflow nodes"],
  ["Enter Next", s("M6 6l6 6-6 6M12 6l6 6-6 6"), "chevrons forward"],
  ["Enter Back", [S("M14.5 4H18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3.5"), S("M17 12H4M8 8l-4 4 4 4")], "arrow return door"],
  ["Enter and Continue", s("M4 12v-1a3 3 0 0 1 3-3h11M15 5l3 3-3 3M20 12v1a3 3 0 0 1-3 3H6M9 19l-3-3 3-3"), "repeat loop proceed"],
  ["Enter and Go", s(`${circ(12, 12, 9)}M7.5 12h9M13 8.5l3.5 3.5-3.5 3.5`), "circle arrow go"],
  ["Enter to Start", s(`${circ(12, 12, 9)}M10 8.5v7l5.5-3.5Z`), "play begin circle"],
  ["Enter to Proceed", s(`${circ(12, 12, 9)}M8 12.5l2.7 2.7 5-5.5`), "check circle continue"],
  ["Enter to Join", [S("M2 12h6.5M5.5 9L8.5 12l-3 3"), S(head(16, 8, 3.5)), S(shoulders(16, 20, 6))], "arrow person user"],
  ["Enter to Access", [S("M2 14.5h7M6 11.5L9 14.5l-3 3"), S(rect(12, 11.5, 10, 8.5, 2)), S("M14.5 11.5V8.5a2.5 2.5 0 0 1 5 0v3")], "arrow lock secure"],
  ["Enter to Unlock", [S("M2 14.5h7M6 11.5L9 14.5l-3 3"), S(rect(12, 11.5, 10, 8.5, 2)), S("M14.5 11.5V8.5a2.5 2.5 0 0 1 4.8-1")], "arrow open lock"],
  ["Enter (Universal)", s("M3 12h10M9 8l4 4-4 4M16 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3"), "login door arrow"],
];
