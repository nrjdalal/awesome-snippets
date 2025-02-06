const config = {
  fn: [
    "fn",
    {
      if_alone: "left_command tab",
    },
  ],
  "fn spacebar": ["left_command spacebar"],
  "fn v": ["$ open '/Applications/Visual Studio Code.app'"],
}

const converted = []

const parseKey = (key) => {
  const parts = key.split(" ")
  return {
    key_code: parts.slice(-1)[0],
    modifiers: {
      mandatory: parts.slice(0, -1),
    },
  }
}

const parseKeyCommand = (command) => {
  const shellCommand = command.includes("$ ")
    ? command.split("$ ").join("")
    : null
  const keyParts = command.split("$ ")[0].split(" ")
  return {
    key_code: keyParts.slice(-1)[0] || null,
    modifiers: [keyParts.slice(0, -1)],
    shell_command: shellCommand,
  }
}

const parseValue = (value) => parseKeyCommand(value[0])

const parseIfAlone = (ifAlone) => {
  if (!ifAlone) return null
  return [parseKeyCommand(ifAlone)]
}

const recursiveNullRemover = (obj) => {
  for (const key in obj) {
    if (
      obj[key] === null ||
      (Array.isArray(obj[key]) && obj[key].length === 0) ||
      (typeof obj[key] === "object" && Object.keys(obj[key]).length === 0)
    ) {
      delete obj[key]
    } else if (typeof obj[key] === "object") {
      recursiveNullRemover(obj[key])
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key]
      }
    }
  }
}

for (const [key, value] of Object.entries(config)) {
  const type = "basic"
  const description = key
  const from = parseKey(key)
  const to = [parseValue(value)]
  const to_if_alone = parseIfAlone(value[1]?.if_alone)

  const obj = { type, description, from, to, to_if_alone }

  recursiveNullRemover(obj)
  converted.push({ manipulators: [obj] })
}

const result = JSON.stringify({
  global: { show_in_menu_bar: false },
  profiles: [
    {
      complex_modifications: {
        rules: converted,
      },
    },
  ],
  name: "nrjdalal",
  selected: true,
  virtual_hid_keyboard: { keyboard_type_v2: "ansi" },
})

console.log(result)
