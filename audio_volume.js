/**
 * Copyright 2018 Bart Butenaers
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
module.exports = function(RED) {
	var AudioAmplifier = require('audio-gain');

	function AudioAnalyserNode(config) {
		RED.nodes.createNode(this, config);
        this.volume = config.volume || 1;

        var node = this;
        
        var options = { volume: node.volume };
        node.audioAmplifier = AudioAmplifier(options);

        node.on("input", function(msg) {
            var audioChunk = msg.payload;
          
            if (!audioChunk) {
              audioChunk = new Buffer();
            }
            
            if (!Buffer.isBuffer(audioChunk)) {
              return;
            }
            
            if (msg.hasOwnProperty('volume')) {
                if (Number.isInteger(msg.volume)) {
                  node.error("The msg.volume field should contain an integer number");
                }
                else {
                  node.audioAmplifier.setVolume(msg.volume);
                }
                
                return;
            }

            // Send the amplified audio chunks to the output
            msg.payload = node.audioAmplifier(audioChunk);
            return msg;
        });
    }
  
	RED.nodes.registerType("audio-analyser", AudioAnalyserNode);
}
