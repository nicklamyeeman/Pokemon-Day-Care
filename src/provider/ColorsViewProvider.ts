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
      });
    }
  }
  _getHtmlForWebview(webview: Webview) {
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">				
				<title>Code Monkey</title>
			</head>
			<body>
				<div style="margin:15px">
					<img id="monkeyImage" src="https://www.placemonkeys.com/250/175?random" style=" border-radius: 0.5rem; box-shadow: 0 8px 17px 2px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12), 0 5px 5px -3px rgba(0,0,0,.2); margin: 0 auto; display: block;" />

					<div style="text-align:right;">
						<span id="exp">${this._daycare.stats.counter.experience}</span>
					</div>
				</div>

				<script nonce="${nonce}">

				const experience = document.getElementById('exp');
				const level = document.getElementById('lvl');
				const monkeyImage = document.getElementById('monkeyImage');
				const progressbar = document.getElementById('progress');
				const nextLevel = document.getElementById('nextLevel');
				let expCount = 0;
				// Handle the message inside the webview
				window.addEventListener('message', event => {
		
					const message = event.data; // The JSON data our extension sent
					
					switch (message.type) {
						case 'updateExp':
							console.log(message);
							experience.textContent = message.exp;	
							progressbar.style='height:15px;border-radius: 5px; width:'+message.percentage+'%; background-color: #27ae60;'; 
							if (level.textContent != message.lvl) {
								level.textContent = message.lvl;
								nextLevel.textContent = message.nextLevel;
								monkeyImage.src = "https://www.placemonkeys.com/200/200?random&" + new Date().getTime();
								
							}
							break;
					}
				});
			</script>
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
