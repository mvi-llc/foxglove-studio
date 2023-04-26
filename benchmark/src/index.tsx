// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { useEffect } from "react";
import ReactDOM from "react-dom";

import Logger from "@foxglove/log";
import { initI18n } from "@foxglove/studio-base";

const log = Logger.getLogger(__filename);
log.debug("initializing");

window.onerror = (...args) => {
  console.error(...args);
};

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("missing #root element");
}

function LogAfterRender(props: React.PropsWithChildren<unknown>): JSX.Element {
  useEffect(() => {
    // Integration tests look for this console log to indicate the app has rendered once
    log.debug("App rendered");
  }, []);
  return <>{props.children}</>;
}

async function main() {
  const { overwriteFetch, waitForFonts } = await import("@foxglove/studio-base");
  overwriteFetch();
  // consider moving waitForFonts into App to display an app loading screen
  await waitForFonts();

  await initI18n();

  const { Root } = await import("./Root");

  ReactDOM.render(
    <LogAfterRender>
      <Root />
    </LogAfterRender>,
    rootEl,
  );
}

void main();
