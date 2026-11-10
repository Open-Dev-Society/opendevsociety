// The binomials: genus from what the tool does, species from its name. Edit freely; a repo missing here gets
// "Species nova" until someone describes it.
export const binomials: Record<string, string> = {
  OpenStock: "Mercator liberus",
  kitbash: "Indagator conflatus",
  "kine-ui": "Gesticula kinetica",
  openreadme: "Vexillum legibile",
  booktrace: "Librarius vestigans",
  opencosmos: "Speculator cosmicus",
  openhaven: "Fragmentaria portuensis",
  openmind: "Ratiocinator mentalis",
  OpenCine: "Spectator cinematicus",
  den: "Latibulum domesticum",
  ports: "Portitor vigilans",
  ByteMyCV: "Curriculum mordax",
  zomb: "Medicus larvalis",
  tearcopy: "Scissura chartacea",
  "settle-ui": "Sedatrix optimistica",
};

export const binomialOf = (name: string) => binomials[name] ?? "Species nova";

/** The colony itself. */
export const SOCIETY = "Societas aperta";
