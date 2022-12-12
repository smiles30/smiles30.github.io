Project: 3D Dice Roll (Utilizing WebGL)
Project Team: Sami Miles and Maegan Jordan

Project Description: 
Our program utilizes texture mapping, cube rotation, and elements of
JavaScript, HTML, and WebGL in order to simulate a die roll. The user
may click a button to roll a six-sided die, which will end up in a
randomly determined position.

Challenges Faced: 
See individual comments.

Future Potential Adjustments: 
Given more time, our team would like to further improve our dice roll
function. As it is, we did not have enough time to adjust the function to
clarify which side the die landed on, nor did we have enough time to set
up an alert function to inform the user of the side they ended up on.
After perfecting the texture mapping as well, we would like to build onto
this project to permit the user to roll larger-sided dice.

Links Referenced and What We Used Them For: 

1. https://smiles30.github.io/cs330/Lab15.html
	We referenced Lab 15 from our previous coursework when there were issues in creating the rotating cube.
2. https://smiles30.github.io/cs330/Lab19.html
	We referenced Lab 19 from our previous coursework for a starting point with our texture creation.
3. https://stackoverflow.com/questions/37116831/how-to-map-different-textures-to-different-faces-of-a-cube-in-webgl
	We looked at this page early on when we were considering how best to map multiple textures onto the cube. We
	decided at first, based on the answer here, to put all of the dice images into one texture and then try to use
	coordinates for different parts of the cube. After meeting with Professor Kruse, we did try for a few days to
	switch to using six different images, but we did eventually come back to this idea of using a single texture.
4. https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html
	This link was found as part of the answer to the question asked in the link above. We used the code here as a
	reference when we ran into issues we could not resolve.
5. https://freeonlinedice.com/
	We looked at this page while considering how we wanted to implement the roll feature,
	but did not look into any source code.
6. https://smiles30.github.io/cs330/DiceRollFunctionTest2.html
	This was the first successful attempt at the roll feature, prior to implementing the successful texture mapping
	and the rolling die together. Initially, the alert pop-up was going to state the number of the die that was most
	visible upon landing, and the 3D image would then shift to fully display that side only, but time ran out before
	we could implement either of these additional features.