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
		const scriptUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, 'src', 'provider', 'script.ts'));
		const styleUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, 'src', 'provider', 'style.css'));

    const nonce = getNonce();

    return (
    `<!DOCTYPE html>
		  <html lang="en">
			  <head>
				  <meta charset="UTF-8">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

  				<meta name="viewport" content="width=device-width, initial-scale=1.0">
        
          <link href="${styleUri}" rel="stylesheet" />
        
          <title>Pokémon Daycare</title>
			  </head>
			  <body>
        <div class="container">
        <div class="screen">
          <div id="spinner" class="spinner"></div>
          <div id="daycare" class="daycare">
            <div id="emplacement-1" class="emplacement"></div>
            <div id="emplacement-2" class="emplacement"></div>
            <div id="emplacement-3" class="emplacement"></div>
            <div id="emplacement-4" class="emplacement"></div>
            <div id="emplacement-5" class="emplacement"></div>
            <div id="emplacement-6" class="emplacement"></div>
            <div id="emplacement-7" class="emplacement"></div>
            <div id="emplacement-8" class="emplacement"></div>
            <div id="emplacement-9" class="emplacement"></div>
          </div>
        </div>
      </div>
				  <script nonce="${nonce}" src="${scriptUri}"></script>
			  </body>
		  </html>`
    );
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
