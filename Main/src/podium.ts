export function createPodiumImageUrl(
    first?: string,
    second?: string,
    third?: string,
) {
    return URL.createObjectURL(
        new Blob(
            [
                `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg
   width="147.30461mm"
   height="138.2034mm"
   viewBox="0 0 147.30461 138.2034"
   version="1.1"
   id="svg1"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs1" />
  <g
     id="layer1"
     transform="translate(-37.109408,-70.363143)">
    <path
       id="rect1"
       style="fill:#ffd439;fill-opacity:1;stroke:#000000;stroke-width:0.503237;stroke-dasharray:none;stroke-opacity:1"
       d="M 83.794368,87.190544 V 130.57446 H 37.361027 v 29.43593 32.8321 15.47244 H 184.1624 V 160.01039 H 134.33289 V 87.190544 Z" />
    <text
       xml:space="preserve"
       style="font-size:12.7px;line-height:1.2;fill:#ffd439;fill-opacity:1;stroke:none;stroke-width:0.503237;stroke-dasharray:none;stroke-opacity:1"
       x="60.238586"
       y="145.66963"
       id="text3"><tspan
         id="tspan3"
         style="text-align:center;text-anchor:middle;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.503237"
         x="60.238586"
         y="145.66963">2</tspan></text>
    <text
       xml:space="preserve"
       style="font-size:12.7px;line-height:1.2;fill:#ffd439;fill-opacity:1;stroke:none;stroke-width:0.503237;stroke-dasharray:none;stroke-opacity:1"
       x="106.98486"
       y="102.85008"
       id="text3-9"><tspan
         id="tspan3-2"
         style="text-align:center;text-anchor:middle;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.503237"
         x="106.98486"
         y="102.85008">1</tspan></text>
    <text
       xml:space="preserve"
       style="font-size:12.7px;line-height:1.2;fill:#ffd439;fill-opacity:1;stroke:none;stroke-width:0.503237;stroke-dasharray:none;stroke-opacity:1"
       x="159.32922"
       y="174.40828"
       id="text3-6"><tspan
         id="tspan3-4"
         style="text-align:center;text-anchor:middle;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.503237"
         x="159.32922"
         y="174.40828">3</tspan></text>
    <text
       xml:space="preserve"
       style="font-size:12.7px;line-height:1.2;text-align:center;text-anchor:middle;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.503237;stroke-dasharray:none;stroke-opacity:1"
       x="107.554"
       y="79.627693"
       id="text4"><tspan
         id="tspan4"
         style="stroke-width:0.503237"
         x="107.554"
         y="79.627693">${first ?? ""}</tspan></text>
    <text
       xml:space="preserve"
       style="font-size:12.7px;line-height:1.2;text-align:center;text-anchor:middle;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.503237;stroke-dasharray:none;stroke-opacity:1"
       x="61.135956"
       y="118.12071"
       id="text5"><tspan
         id="tspan5"
         style="stroke-width:0.503237"
         x="61.135956"
         y="118.12071">${second ?? ""}</tspan></text>
    <text
       xml:space="preserve"
       style="font-size:12.7px;line-height:1.2;text-align:center;text-anchor:middle;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.503237;stroke-dasharray:none;stroke-opacity:1"
       x="160.76492"
       y="152.83989"
       id="text6"><tspan
         id="tspan6"
         style="stroke-width:0.503237"
         x="160.76492"
         y="152.83989">${third ?? ""}</tspan></text>
  </g>
</svg>
`,
            ],
            { type: "image/svg+xml" },
        ),
    );
}
