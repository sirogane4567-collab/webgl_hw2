# 26' Spring CS380 Assignment #2: An Avatar of Lost Arcball

## Due: April 15th, 2026 (11:59 PM)

## Contact: cs380_ta@cgv.kaist.ac.kr

# Important notices

* **No score** will be given for plagiarised work.
* **Do not share** your works online or offline. If it is discovered, they will be regarded as plagiarised works.
    * Do not upload your works on public repositories like GitHub.
    * If you do, you **must** set the proper visibility settings for your project to prevent any plagiarism.

* For any **late submissions**, TAs will deduct 1 point + 0.5 points for every 12 hours. No scores will be given after **3 days**. 

* You may use AI tools (e.g. ChatGPT, Github Copilot) for learning. However,
    * We recommend to finish the assignment on your own. 
    * You must specify which point you struggle on, which tools you use, and what you learn from the response. Check **Report** section for details.

* Please use Q&A board for questions regarding homework assignment.

# Overview

In this assignment, you will make your own interactive avatar
with 3D hierarchical modeling.
You will also improve your knowledge and skills that you get in the last assignment and previous lab sessions.

To complete this assignment,

1. you have to implement to generate cone and cylinder mesh in `modules/cs380/primitives.js`;
2. your avatar must consist of spheres, cones, and cylinders in with hierarchical structures;
3. your avatar needs to be implemented so that it can change the posture from the user's keyboard/mouse input.

You can start your work based on your scene of assignment #1 if you want,
but we recommend you to start from scratch in `modules/assignments/assignment2.js`.

* **Do not import external mesh files.** You must build your avatar using the primitive meshes generated in `modules/cs380/primitives.js` (sphere, cone, cylinder, etc.).
* **Do not use textures.** Each body part should be colored only via `uniforms.mainColor`.

# Basic Requirements (Due: April 15th)

## 1. 3D Geometric Objects

Implement `generateCone` and `generateCylinder` functions in `modules/cs380/primitives.js`.

One of the practice task in Lab #4 is to generate sphere object
by modifying `generateSphere` function in `modules/cs380/primitives.js`.
In this assignments, you have to modify `generateCone` and `generateCylinder` as well so that
you can use the meshes to build your avatar.

The type of the return values must be an object that
contains vertex positions (`vertices` array), and
the surface normal unit-vectors (`vertexNormals` array).
You may also construct `indices` array for VBO indexing if you want. (Please refer to implementation of `generateCube`)

Here is the intended spec of the functions.

- `generateCone(sides, radius, height)` - 1 pt
  - A 3D cone with a radius of `radius` at the bottom. The top vertex is at `height`, and the number of bottom face's sides is `sides`.
- `generateCylinder(sides, radius, height)` - 1 pt
  - A 3D cylinder with a radius of `radius` at the bottom and top. The top face is at `height`, and the number of bottom face's sides is `sides`.

When you are confused about any implementation detail, please write your assumption about that in your report. Any reasonable assumption would be accepted.

## 2. Hierarchical Modeling of Avatar

Create your own avatar with hierarchical structures.

Your avatar components should consist of several kinds of 3D objects.
Specifically, it should have

- at least one sphere,
- at least one cone,
- at least one cylinder,
- (optional) any other 3D objects such as cubes, snowflakes, stars, etc.

- Each body part should be created using `cs380.RenderObject` with an appropriate primitive mesh.
- Body parts should be connected using **parent-child transform relationships** (`transform.setParent()`), so that moving a parent part also moves its children.
- Each body part should have a distinct color assigned via `uniforms.mainColor`.

For example, an arm could be built from a sphere (shoulder joint) and a cylinder (upper arm), where the cylinder's transform is parented to the sphere's transform.

You may use any combination of primitives and are free to design your own character. You are encouraged to add accessories or decorations to make your avatar unique.

Additionally, your avatar should have a basic structure as follows:

![Avatar Parts Requirements](/pics/avatar-parts.png)

That is, there should be at least 10 objects for your avatar.
You can freely choose which mesh/shape each component is rendered as.
You may divide each part into subparts if you want.
For example, the body part may be divided into middle/lower body parts.

If you are to hard-code such transforms, your work on "Interactive Avatar Pose" will become much more difficult.

## 3. Interactive Avatar Pose

Your avatar must respond to the user's input and change its pose.
You must include at least **rotations of arms and legs** 

### Input Events

Your avatar must support the following two types of input. There would be a 0.5 pts deduction for each missing type.

1. **Keyboard input**: Use keyboard keys to control the avatar's pose.
2. **Mouse input (Object Picking)**: Click on specific parts of the avatar to trigger an interaction.

You may also create HTML components (e.g., `<button>`, `<select>`) for additional interaction, but those should not be the only interaction methods.

### Object Picking

Your scene must support **object picking** — the user should be able to click on specific parts of the avatar to trigger a visible response (e.g., rotating an arm, changing a color, triggering an animation).

At least **2 parts** of the avatar should be pickable. To implement picking:
- Use `cs380.PickableObject` instead of `cs380.RenderObject` for the parts you want to be clickable. `PickableObject` takes additional parameters: a picking shader and a unique picking ID.
- Set up a `cs380.PickingBuffer` and render pickable objects into it each frame.
- On mouse click, use `pickingBuffer.pick(x, y)` to determine which object was clicked based on the pixel color at the click position.

You may refer to the `cs380.PickingShader` and `cs380.PickableObject` classes in the framework, as well as the Lab #4 slides, for implementation details.

### Pose Details

There is no detailed restriction about the pose changes. These things are totally up to your thinking:

- how much angle/distance each part can rotate/translate;
- which inputs each part responds to;
- whether the change is shown as a smooth animation or a discontinuous one, etc.

Show your creativity in this task!

## 4. Creativity

Your avatar must include at least one **accessory or decoration** (e.g., a hat, glasses, weapon, wings, tail, etc.) beyond the basic body structure. Briefly describe your creative choices in your report.

You will receive **0 points** for creativity if:

- Your avatar is exactly the same as the demo or lab example avatar.
- Your avatar has no accessories or decorations at all.

You are encouraged to explore different character designs and themes with your own ideas.

## 5. Challenges

You may choose one of the following challenges and implement it for additional credit. You can receive at most 1 point for the challenge section, even if you implement multiple challenges.

These challenges are intended to encourage you to explore concepts beyond the basic requirements. Each challenge should demonstrate a meaningful technical extension of your assignment.

Please describe your implementation and approach in your report.

### 5.1 Context-sensitive Interaction

Implement an interaction where the behavior depends on the spatial relationship between body parts. For example:
- The avatar opens its mouth when a microphone (held in hand) is brought close to it
- A body part changes color when it collides with another part

This requires computing distances or relationships between transforms at runtime.

### 5.2 Make-your-own challenge
You may also propose your own challenge instead of selecting one of the listed options.
If you choose this option, you must clearly describe the challenge in your report, including:
- What technical feature you implemented
- Why is it technically challenging
- How you implemented it


## Specifications and Points

| Specification                      | Point |
| ---------------------------------- | ----- |
| 1. 3D geometric objects            | 2     |
| 2. Hierarchical modeling of avatar | 1     |
| 3. Interactive avatar pose         | 1     |
| 4. Creativity                      | 1     |
| 5. Challenge                       | 1     |
| Total                              | 6     |


# Submission

## Report

Explain the overall concept of your avatar and how you implemented each requirement.
TAs will *only* grade the features described in your report. If a feature in the report does not work in the code, then no points will be given for that feature. There are no page limit, but please include the image of expected result of your implementation.

**Format**: Only `.docx`, `.pdf`, and `.md` formats are allowed.
Include your report within your code directory.
Both Korean and English are acceptable.

Below is the suggested format of your Report: (example)

1. Concept of My Avatar
2. Implementation
    1. 3D Geometric Objects (Cone, Cylinder)
    2. Hierarchical Modeling
    3. Interactive Avatar Pose
    4. Challenges
3. Use of AI
    1. Tools I used
    2. Parts where I struggled
    3. What I learned

## Code

Compress your project directory including your report, using the provided Python script `archive.py`.
Running `python3 archive.py [Student ID]` will generate a submission file.
TAs will run your code *as-is* using Mozilla Firefox, so please double-check that your submission file runs correctly before submitting.

**Format**: Only `.zip` format is allowed for submission.
