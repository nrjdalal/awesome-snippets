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

for (const [key, value] of Object.entries(config)) {
  const type = "basic"
  const description = key
  let from = {
    key_code: key.split(" ").slice(-1)[0],
    modifiers: {
      mandatory: key.split(" ").slice(0, -1),
    },
  }

  let to = [
    {
      key_code: value[0].split("$ ")[0].split(" ").slice(-1)[0] || null,
      modifiers: value[0].split("$ ")[0].split(" ").slice(0, -1),
      shell_command: value[0].includes("$ ")
        ? value[0].split("$ ").join("")
        : null,
    },
  ]

  let to_if_alone = value[1]?.if_alone
    ? [
        {
          key_code:
            value[1]?.if_alone.split("$ ")[0].split(" ").slice(-1)[0] || null,
          modifiers: value[1]?.if_alone.split("$ ")[0].split(" ").slice(0, -1),
          shell_command: value[1]?.if_alone.includes("$ ")
            ? value[1]?.if_alone.split("$ ").join("")
            : null,
        },
      ]
    : null

  let obj = {
    type,
    description,
    from,
    to,
    to_if_alone,
  }

  const recursive_null_remover = (obj) => {
    for (const key in obj) {
      if (
        obj[key] === null ||
        (Array.isArray(obj[key]) && obj[key].length === 0) ||
        (typeof obj[key] === "object" && Object.keys(obj[key]).length === 0)
      ) {
        delete obj[key]
      } else if (typeof obj[key] === "object") {
        recursive_null_remover(obj[key])
        if (Object.keys(obj[key]).length === 0) {
          delete obj[key]
        }
      }
    }
  }

  recursive_null_remover(obj)
  converted.push({
    manipulators: [obj],
  })
}

console.log(
  JSON.stringify({
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
  }),
)
