import { BaseDriver } from '..';
import { errors } from 'mobile-json-wire-protocol';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mochawait';
import logger from '../lib/logger.js';
import sinon from 'sinon';

const should = chai.should();
chai.use(chaiAsPromised);

describe('Desired Capabilities', () => {

  let d;

  beforeEach(() => {
    d = new BaseDriver();
    sinon.spy(logger, 'warn');
  });

  afterEach(() => {
    logger.warn.restore();
  });

  it('should require platformName and deviceName', async () => {
    try {
      await d.createSession({});
    } catch (e) {
      e.should.be.instanceof(errors.SessionNotCreatedError);
      e.message.should.contain('platformName');
      e.message.should.contain('deviceName');
      return;
    }

    should.fail('error should have been thrown');
  });

  it('should require platformName', async () => {
    try {
      await d.createSession({'platformName': 'iOS'});
    } catch (e) {
      e.should.be.instanceof(errors.SessionNotCreatedError);
      e.message.should.contain('deviceName');
      return;
    }

    should.fail('error should have been thrown');
  });

  it('should require deviceName', async () => {
    try {
      await d.createSession({'deviceName': 'Delorean'});
    } catch (e) {
      e.should.be.instanceof(errors.SessionNotCreatedError);
      e.message.should.contain('platformName');
      return;
    }

    should.fail('error should have been thrown');
  });

  it('should not care about cap order', async () => {

    await d.createSession({
      deviceName: 'Delorean',
      platformName: 'iOS'
    });

  });

  it('should check required caps which are added to driver', async () => {
    d.desiredCapConstraints = {
      necessary: {
        presence: true
      },
      proper: {
        presence: true,
        isString: true,
        inclusion: ['Delorean', 'Reventon']
      }
    };

    try {
      await d.createSession({
        'platformName': 'iOS',
        'deviceName': 'Delorean'
      });
    } catch (e) {
      e.should.be.instanceof(errors.SessionNotCreatedError);
      e.message.should.contain('necessary');
      e.message.should.contain('proper');
      return;
    }

    should.fail('error should have been thrown');
  });

  it('should check added required caps in addition to base', async () => {
    d.desiredCapConstraints = {
      necessary: {
        presence: true
      },
      proper: {
        presence: true,
        isString: true,
        inclusion: ['Delorean', 'Reventon']
      }
    };

    try {
      await d.createSession({
        necessary: 'yup',
        proper: 'yup, your highness'
      });
    } catch (e) {
      e.should.be.instanceof(errors.SessionNotCreatedError);
      e.message.should.contain('platformName');
      e.message.should.contain('deviceName');
      return;
    }

    should.fail('error should have been thrown');
  });

  it('should accept extra capabilities', async () => {
    await d.createSession({
      'platformName': 'iOS',
      'deviceName': 'Delorean',
      'extra': 'cheese',
      'hold the': 'sauce'
    });
  });

  it('should log the use of extra caps', async function () {
    this.timeout(500);

    await d.createSession({
      'platformName': 'iOS',
      'deviceName': 'Delorean',
      'extra': 'cheese',
      'hold the': 'sauce'
    });

    logger.warn.callCount.should.be.above(0);
  });

  it('should be sensitive to the case of caps', async () => {
    try {
      await d.createSession({
        'platformname': 'iOS',
        'deviceName': 'Delorean'
      });
    } catch (e) {
      e.should.be.instanceof(errors.SessionNotCreatedError);
      e.message.should.contain('platformName');
      return;
    }

    should.fail('error should have been thrown');
  });

  it ('should error if objects in caps', async function () {
    try {
      await d.createSession({
        'platformName': {a: 'iOS'},
        'deviceName': 'Delorean'
      });
    } catch (e) {
      e.should.be.instanceof(errors.SessionNotCreatedError);
      e.message.should.contain('platformName');
      return;
    }

    should.fail('error should have been thrown');
  });

  it('should check for deprecated caps', async function () {
    this.timeout(500);

    d.desiredCapConstraints = {
      'lynx-version': {
        deprecated: true
      }
    };

    await d.createSession({
      'platformName': 'iOS',
      'deviceName': 'Delorean',
      'lynx-version': 5
    });

    logger.warn.callCount.should.be.above(0);
  });

  it('should not warn if deprecated=false', async function () {
    this.timeout(500);

    d.desiredCapConstraints = {
      'lynx-version': {
        deprecated: false
      }
    };

    await d.createSession({
      'platformName': 'iOS',
      'deviceName': 'Delorean',
      'lynx-version': 5
    });

    logger.warn.callCount.should.equal(0);
  });
});
