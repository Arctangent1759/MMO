YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "EventDispatcher",
        "FlashPlugin",
        "HTMLAudioPlugin",
        "Log",
        "Sound",
        "SoundInstance",
        "SoundJS",
        "WebAudioPlugin"
    ],
    "modules": [
        "SoundJS"
    ],
    "allModules": [
        {
            "displayName": "SoundJS",
            "name": "SoundJS",
            "description": "The SoundJS library manages the playback of audio on the web. It works via plugins which abstract the actual audio\nimplementation, so playback is possible on any platform without specific knowledge of what mechanisms are necessary\nto play sounds.\n\nTo use SoundJS, use the public API on the {{#crossLink \"Sound\"}}{{/crossLink}} class. This API is for:\n<ul><li>Installing audio playback Plugins</li>\n     <li>Registering (and preloading) sounds</li>\n     <li>Creating and playing sounds</li>\n     <li>Master volume, mute, and stop controls for all sounds at once</li>\n</ul>\n\n<b>Please note that as of version 0.4.0, the \"SoundJS\" object only provides version information. All APIs from\nSoundJS are now available on the {{#crossLink \"Sound\"}}{{/crossLink}} class.</b>\n\n<b>Controlling Sounds</b><br />\nPlaying sounds creates {{#crossLink \"SoundInstance\"}}{{/crossLink}} instances, which can be controlled individually.\n<ul><li>Pause, resume, seek, and stop sounds</li>\n     <li>Control a sound's volume, mute, and pan</li>\n     <li>Listen for events on sound instances to get notified when they finish, loop, or fail</li>\n</ul>\n\n<h4>Feature Set Example</h4>\n     createjs.Sound.addEventListener(\"fileload\", createjs.proxy(this.loadHandler, this));\n     createjs.Sound.registerSound(\"path/to/mySound.mp3|path/to/mySound.ogg\", \"sound\");\n     function loadHandler(event) {\n         // This is fired for each sound that is registered.\n         var instance = createjs.Sound.play(\"sound\");  // play using id.  Could also use full sourcepath or event.src.\n         instance.addEventListener(\"complete\", createjs.proxy(this.handleComplete, this));\n         instance.setVolume(0.5);\n     }"
        }
    ]
} };
});