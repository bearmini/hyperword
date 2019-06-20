const { exec } = require('child_process');

let patterns = [];

const match = (data) => {
  for (const p of patterns) {
    const re = new RegExp(p.pattern);
    if (re.test(data)) {
      return p;
    }
  }
  return null;
}

exports.middleware = (store) => (next) => (action) => {
  //console.log('action ==', action);
  switch (action.type) {
  case 'CONFIG_LOAD':
  case 'CONFIG_RELOAD':
    const { config } = action;
    if (config && config.hyperword && config.hyperword.patterns) {
      patterns = config.hyperword.patterns;
    }
    break;

  case 'SESSION_ADD_DATA':
    const { data } = action;
    const matched = match(data);
    if (!matched) {
      break;
    }

    console.log('MATCHED!!!', matched);

    exec(matched.command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
    break;

  }

  next(action);
};
