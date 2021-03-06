var JiraClient = require('jira-connector');
require('dashing-js');

//Edit this auth information
var host = 'jira.myteam.ru';
var protocol = 'http';
var username = 'admin';
var password = 'thepassword';
var jql = 'project in (BACK, FRONT) AND issuetype = Ошибка ORDER BY priority DESC';
//*****

var jira = new JiraClient( {
    host: host,
	protocol: protocol,
	basic_auth: {
        username: username,
        password: password
    }
});

var blockersCount;
var issuesArray;
var issues = [];
var noproblems = null;

setInterval(function() {
  jira.search.search({
	jql: jql
	}, function(error, search) {
		noproblems = true;
		issuesArray = search.issues;
		blockersCount = search.total;
		for (i = 0; i < blockersCount; i++) {
			noproblems = false;
			console.log(issuesArray[i].key);
			var issue = {
					id: issuesArray[i].key,
					issueUrl: protocol+"://"+"/browse/"+issuesArray[i].key,
					title: issuesArray[i].fields.summary,
					assigneeName: issuesArray[i].fields.assignee.name,
					assigneeAvatarUrl: issuesArray[i].fields.assignee.avatarUrls["24x24"]
				};
			issues.push(issue);	
		}
	});
  
  send_event('jira-list-issues-jql', { noproblems: noproblems, header: 'Bugs', issue_type: "Sub-title", issues: issues});
  issues = [];
}, 2 * 60000);
