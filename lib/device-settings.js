import _ from 'lodash';
import log from './logger';

class DeviceSettings {

  constructor (defaultSettings = {}) {
    this._settings = defaultSettings;
  }

  // calls updateSettings from implementing driver every time a setting is changed.
  async update (newSettings) {
    if (!_.isObject(newSettings)) {
      throw new Error("Settings update should be called with valid JSON");
    }
    for (let prop of _.keys(newSettings)) {
      if(this._settings[prop] !== newSettings[prop]) {
        let updatePayload = {
          key: prop,
          value: newSettings[prop],
          oldValue: this._settings[prop],
        };
        this._settings[prop] = newSettings[prop];
        // update setting only when there is updateSettings defined.
        if (this.onSettingsUpdate) {
          await this.onSettingsUpdate(updatePayload);
        } else {
          log.errorAndThrow("Unable to update settings; onSettingsUpdate method not found");
        }
      }
    }
  }

  getSettings () {
    return this._settings;
  }
}

export default DeviceSettings;
