Thank you for downloading the source code for:
Introducing HTML5 Game Development: Developing Games with Impact

I have broken up the source code into the following folders:

lessons - Contains source code for each major lesson in the book.
media - This is all of the graphics and sounds you will need for your game.
ps-scripts - This is a Photoshop script that turns layers into sprite sheets/
psds - the two source files for the player and monster.
resident-raver-iOS-source - Source code for iOS version of the game.
resident-raver-web-source - Full source code for the final game.

Running the code
In order to run the code you will need a copy of Impact which you can buy from http://impactjs.com/buy-impact.

Each of the source code folders contain the main code you need to run the game. If you are building a web project, simply copy the game folder into the /impact/lib folder of your impact project. You will replace the existing game folder. Then copy over the media folder to the /impact directory.

For the iOS project, you will replace the game directory in iOSImpact/game/lib. The iOS project's code sits inside of a game directory so make sure you replace the game folder inside of lib. Also you will need the media folder as well. Once you have added those two folders you should be able to run the game in Xcode.