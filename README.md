# Ember Ace [![Build Status](https://travis-ci.org/dfreeman/ember-ace.svg?branch=master)](https://travis-ci.org/dfreeman/ember-ace)

An Ember component wrapping [Ace editor](https://ace.c9.io).

## Installation

```bash
ember install ember-ace
```

## Usage

```hbs
{{ember-ace lines=10 value=value update=(action 'valueUpdated')}}
```

### Options

#### Core
 - value
 - update
 - ready

#### Configuration
 - mode
 - theme
 - useSoftTabs
 - tabSize
 - useWrapMode
 - highlightActiveLine
 - showPrintMargin
 - printMarginColumn
 - showInvisibles
 - readOnly

#### Sizing
 - lines
 - minLines
 - maxLines

#### Overlays
 - markers
 - annotations

### Build Configuration

 - modes
 - themes
 - exts
 - keybindings
 - workers
