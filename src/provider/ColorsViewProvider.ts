import {
  CancellationToken,
  Uri,
  Webview,
  WebviewView,
  WebviewViewResolveContext,
} from "vscode";
import { DayCare } from "../daycare/DayCare";

export class ColorsViewProvider {
  _extensionUri: Uri;
  _daycare: DayCare;
  _view?: WebviewView;
  static viewType: string = "pokemon-daycare.webview";

  constructor(_extensionUri: Uri, _daycare: DayCare) {
    this._extensionUri = _extensionUri;
    this._daycare = _daycare;
  }

  resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    _token: CancellationToken
  ) {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }
  updateDaycare(daycare: DayCare) {
    var _a, _b;
    if (this._view) {
      (_b = (_a = this._view).show) === null || _b === void 0
        ? void 0
        : _b.call(_a, true);
      this._view.webview.postMessage({
        type: "updateExp",
        exp: daycare.stats.counter.experience,
        level: daycare.stats.counter.level,
        money: daycare.stats.wallet.money,
      });
    }
  }
  _getHtmlForWebview(webview: Webview) {
    const scriptUri = webview.asWebviewUri(
      Uri.joinPath(this._extensionUri, "src", "provider", "script.ts")
    );
    const styleUri = webview.asWebviewUri(
      Uri.joinPath(this._extensionUri, "src", "provider", "style.css")
    );

    const nonce = getNonce();
    const exp = `exp : ${this._daycare.stats.counter.experience}`
    const money = `${this._daycare.stats.wallet.money}`
    const level = `Niv. ${this._daycare.stats.counter.level}`

    return `
    <!DOCTYPE html>
		  <html lang="en">
			  <head>
				  <meta charset="UTF-8">
          <meta content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

  				<meta name="viewport" content="width=device-width, initial-scale=1.0">
        
          <link href="${styleUri}" rel="stylesheet" />
        
          <title>Pokémon Daycare</title>
			  </head>
			  <body>
          <div class="container">
          <div class="screen">
            <div id="infosbox" class="box">
              <div id="infos" class="info">
                <div id="level" class="level">
                  <span id="globalleveltext" class="text"> ${level} </span>
                  <span class="text">
                    <div id="coin" class="coin">
                      <div></div>
                    </div>
                    <span id="globalmoneytext">
                    ${money}
                  </span>
                  </span>
                </div>
                <div id="exp" class="exp">
                  <div id="expbar" class="expbar">
                    <div id="globalexpprogress" class="expprogress"></div>
                  </div>
                  <span id="globalexptext" class="textsm"> ${exp} </span>
                </div>
              </div>
            </div>
            <div id="daycare" class="daycare">
              <div class="emplacement">
                <div class="img">
                  <img
                    class="pokemon-img"
                    alt="toto"
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/55.png"
                  />
                  <img
                    class="egg"
                    alt="toto"
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/egg.png"
                  />
                </div>
                <div id="infos" class="info">
                  <div id="level" class="level">
                    <span id="leveltext" class="text"> Niv. 1 </span>
                  </div>
                  <div id="exp" class="exp">
                    <div id="expbar" class="expbar">
                      <div id="expprogress" class="expprogress"></div>
                    </div>
                    <span id="exptext" class="textsm"> exp: 80 </span>
                  </div>
                </div>
              </div>
              <div class="emplacement">
                <div class="img">
                <img
                class="pokemon-img"
                alt="toto"
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/55.png"
              />
                  <img
                    class="egg"
                    alt="toto"
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/egg.png"
                  />
                </div>
                <div id="infos" class="info">
                  <div id="level" class="level">
                    <span id="leveltext" class="text"> Niv. 10000 </span>
                  </div>
                  <div id="exp" class="exp">
                    <div id="expbar" class="expbar">
                      <div id="expprogress" class="expprogress"></div>
                    </div>
                    <span id="exptext" class="textsm"> exp: 850 </span>
                  </div>
                </div>
              </div>
              <div class="emplacement">
                <div class="img">
                  <img
                    class="pokemon-img"
                    alt="toto"
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1005.png"
                  />
                  <img
                    class="egg"
                    alt="toto"
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/egg.png"
                  />
                </div>
                <div id="infos" class="info">
                  <div id="level" class="level">
                    <span id="leveltext" class="text"> Niv. 10000 </span>
                  </div>
                  <div id="exp" class="exp">
                    <div id="expbar" class="expbar">
                      <div id="expprogress" class="expprogress"></div>
                    </div>
                    <span id="exptext" class="textsm"> exp: 850 </span>
                  </div>
                </div>
              </div>
            </div>
    
            <div id="textbox" class="box">
              <span id="eventtext" class="text">
                Trainer machin a déposé truc Trainer machin a déposé truc
              </span>
            </div>
          </div>
        </div>
				  <script nonce="${nonce}" src="${scriptUri}"></script>
			  </body>
		  </html>`;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
