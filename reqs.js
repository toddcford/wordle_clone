/*

V1:

- you provide five char guesses
- each guess must be a word
- when you press enter,
  - board
    - you see the status 
      - letters in wrong position turn yellow
      - missing letters are greyed out
      - correct guesses + position turn green
      - shake the active row on word we dont know
  - keyboard
    - reflects same data
    - third row is enter [...] backspace
    - you can input by typing
    - when you press enter, each letter animates into rotating black to grey

  - you only see past + active attempt
  - if you make too may attempts you probably die
  - initial visual state
    - all rows are empty
    - as i fill out my guess, background is black
    - filled out cells have slight border highlight

  V0:
  
  - you provide five char guesses
  - each guess must be a word
  - when you press enter,
    - board
      - you see the status 
        - letters in wrong position turn yellow
        - missing letters are greyed out
        - correct guesses + position turn green
        - don't let unknown words pass
    - keyboard
      - reflects same data
      - third row is enter [...] backspace
      - you can input by typing
      - when you press enter, each letter animates into rotating black to grey

    - you only see past + active attempt
    - if you make too may attempts you probably die
    - initial visual state
    - all rows are empty
    - as i fill out my guess, background is black
    - filled out cells have slight border highlight

    */
