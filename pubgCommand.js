/**
 * pubgCommand.js
 *
 * This command is to check yours pubg stats.
 */
(function() {
    function _getJSON(url){
        var HttpRequest = Packages.com.gmt2001.HttpRequest;
        var HashMap = Packages.java.util.HashMap;
        var h = new HashMap();
        var responseData = HttpRequest.getData(HttpRequest.RequestType.GET, encodeURI(url), '', h);
        return responseData.content;
    }

    function capsText(str) {
        var s2 = str.trim().toLowerCase().split(' ');
        var s3 = [];
        s2.forEach(function(elem, i) {
            s3.push(elem.charAt(0).toUpperCase().concat(elem.substring(1)));
        });
        return s3.join(' ');
    }

    function matchInArray(string, expressions) {
        var len = expressions.length,
            i = 0;
        for (; i < len; i++) {
            if (string.match(expressions[i])) {
                return true;
            }
        }
        return false;
    };

    $.bind('discordChannelCommand', function(event) {
        var channel = event.getChannel(),
            command = event.getCommand(),
            sender = event.getMention(),
            arguments = event.getArguments(),
            args = event.getArgs(),
            argsString,
            action = args[0],
            username = args[0],
            statsType = args[1],
            statsRegion = args[2];

        var allowedType = ['solo','duo','squad'],
            allowedRegion = ['na','eu','sa','oc','as','sea'];

        if (command.equalsIgnoreCase('pubg')) {
            // Check arguments
            if (username === undefined) {
                $.discord.say(channel, $.lang.get('pubg.useage', sender));
                return;
            }

            // Get JSON and parse stats
            var json = JSON.parse(_getJSON("https://api.alixe.pro/pubg/?user=" + username + "&debug=true"));

            // Decide which stats types to print
            var displayTypes;
            if (statsType === undefined) {
                displayTypes = 'solo';
            } else {
                displayTypes = ''+statsType+'';
                if (!matchInArray(displayTypes,allowedType)) {
                    $.discord.say(channel, $.lang.get('pubg.useage', sender));
                    return;
                }
            }

            // Decide which stats region to print
            var displayRegion;
            if (statsRegion === undefined) {
                displayRegion = 'eu';
            } else {
                displayRegion = ''+statsRegion+'';
                if (!matchInArray(displayRegion,allowedRegion)) {
                    $.discord.say(channel, $.lang.get('pubg.useage', sender));
                    return;
                }
            }

            // Iterate over stats types and add formatted string to output
            // Iterate over stats types and add formatted string to output
            if (json[displayRegion + '-' + displayTypes]) {
                var PlayerName = json[displayRegion + '-' + displayTypes]['Player Name'],
                    KDRatio = json[displayRegion + '-' + displayTypes]['K/D Ratio'],
                    DailyKills = json[displayRegion + '-' + displayTypes]['Daily Kills'],
                    WeeklyKills = json[displayRegion + '-' + displayTypes]['Weekly Kills'],
                    WinPC = json[displayRegion + '-' + displayTypes]['Win %'],
                    Wins = json[displayRegion + '-' + displayTypes]['Wins'],
                    Top10Rate = json[displayRegion + '-' + displayTypes]['Top 10 Rate'],
                    TimeSurvived = json[displayRegion + '-' + displayTypes]['Time Survived'],
                    Rating = json[displayRegion + '-' + displayTypes]['Rating'],
                    RoundsPlayed = json[displayRegion + '-' + displayTypes]['Rounds Played'],
                    Kills = json[displayRegion + '-' + displayTypes]['Kills'],
                    Assists = json[displayRegion + '-' + displayTypes]['Assists'],
                    Suicides = json[displayRegion + '-' + displayTypes]['Suicides'],
                    KnockOuts = json[displayRegion + '-' + displayTypes]['Knock Outs'],
                    output = PlayerName + "'s stats summary:\r\n[" + displayRegion.toUpperCase() + "-" + capsText(displayTypes) +"]\r\n[Daily Kills: " + DailyKills + "]\r\n[Weekly Kills: " + WeeklyKills + "]\r\n[Skill Rating: " + Rating + "]\r\n[K/D ratio: " + KDRatio + "]\r\n[Wins: " + Wins + "] \r\n[Top 10 Rate: " + Top10Rate + "]\r\n[Win %: " + WinPC + "]\r\n[Time Survived: " + TimeSurvived + "]";

                $.discord.say(channel, $.lang.get('pubg.stats', sender, "(embed 0 255 0, " + output + ")"));
            } else {
                $.discord.say(channel, $.lang.get('pubg.nouser', sender, username, displayRegion.toUpperCase() + "-" + capsText(displayTypes)));
                return;
            }
        }
    });

    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./discord/custom/commands/pubgCommand.js')) {
            $.discord.registerCommand('./discord/custom/commands/pubgCommand.js', 'pubg', 6);
        }
    });
})();