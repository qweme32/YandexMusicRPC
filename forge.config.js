module.exports = {
  icon:  __dirname + "/icon.ico",
  name: "Yandex.Music.Client",
  authors: 'qweme32',
  packagerConfig: {
    icon:  __dirname + "/icon.ico",
    name: "Yandex.Music.Client",
    authors: 'qweme32',
  },
  rebuildConfig: {
    icon:  __dirname + "/icon.ico",
    name: "Yandex.Music.Client",
    authors: 'qweme32',
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        
        name: "Yandex.Music.Client",
        authors: 'qweme32',
        description: 'YandexMusic client with discord rich-presence integration',
        // An URL to an ICO file to use as the application icon (displayed in Control Panel > Programs and Features).
        // The ICO file to use as the icon for the generated Setup.exe
        setupIcon: __dirname + "/icon.ico",
        icon:  __dirname + "/icon.ico",
		    iconUrl: __dirname + "/icon.ico"
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
