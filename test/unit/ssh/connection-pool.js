var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  Connection = require('../../../lib/ssh/connection'),
  ConnectionPool = require('../../../lib/ssh/connection-pool');

chai.use(require('sinon-chai'));

describe('SSH Connection pool', function () {
  var connection1, connection2, pool;

  beforeEach(function () {
    connection1 = new Connection('user@host1');
    connection2 = new Connection('user@host2');

    pool = new ConnectionPool([connection1, connection2]);

    sinon.stub(connection1, 'run').yields();
    sinon.stub(connection2, 'run').yields();
  });

  describe('constructor', function () {
    it('should be possible to create a new ConnectionPool using shorthand syntax', function () {
      var pool = new ConnectionPool(['myserver', 'myserver2']);
      expect(pool.connections[0].config).to.deep.equal({ user: 'deploy', host: 'myserver' });
      expect(pool.connections[1].config).to.deep.equal({ user: 'deploy', host: 'myserver2' });
    });
  });

  describe('#run', function () {
    it('should run command on each pool', function (done) {
      pool.run('my-command', function (err) {
        if (err) return done(err);
        expect(connection1.run).to.be.called;
        expect(connection2.run).to.be.called;
        done();
      });
    });
  });
});