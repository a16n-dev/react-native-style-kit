# React Native Style Kit

Styling API for React Native, engineered as a foundational layer for building design systems and component libraries. What you get:

- 🧩 Variants/compound variants inspired by CVA
- 🎨 Theming & theme switching
- 📱 Breakpoint logic
- 📏 Access to runtime values (safe area insets, screen dimensions) in stylesheets

All with no babel/metro plugins, full compatibility with 3rd party components, and a focus on performance.

## Installation

You know the drill 😄
```bash
pnpm install react-native-style-kit
```


You're almost ready to go! You'll also need to wrap your app in `<StyleKitProvider>` (more on this later)

```tsx
import { StyleKitProvider } from 'react-native-style-kit';

const Main = () => {
  return (
    <StyleKitProvider>
      <App />
    </StyleKitProvider>
  );
}
```

## Concepts

### Creating styles

Styles are created via `makeUseStyles()` which is a drop-in replacement for `StyleSheet.create()`. This function returns a hook you can call within your component to access the styles.

```tsx
import { makeUseStyles } from 'react-native-style-kit';


const useStyles = makeUseStyles({
  root: {
    backgroundColor: 'white',
    padding: 16,
  }
});

const Button = () => {
    const styles = useStyles();
    
    return <Pressable style={styles.root}/>
}
```

### Theming

Define a theme, then pass it to your `StyleKitProvider`. If you're using TypeScript, also augment the theme type to get the correct typings across your app.
```tsx

const theme = {...};

type ThemeType = typeof theme;

declare module 'react-native-style-kit' {
  interface StyleKitTheme extends ThemeType {}
}

const Main = () => {
  return (
    <StyleKitProvider theme={theme}>
      <App />
    </StyleKitProvider>
  );
}
```


You can then create styles that access the theme by passing a function to`makeUseStyles()` instead of an object
```tsx
import { makeUseStyles } from 'react-native-style-kit';

const useStyles = makeUseStyles(({ theme }) => ({
  root: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  }
}));

const Button = () => {
    const styles = useStyles();
    
    return <Pressable style={styles.root}/>
}
```

You can also access the theme directly with the `useTheme()` hook.

```tsx
import { useTheme } from 'react-native-style-kit';

const Button = () => {
  const theme = useTheme();
    
  return <Pressable 
    style={(pressed) => ({ 
      backgroundColor: pressed ? theme.colors.highlight : theme.colors.background 
    })}
  />
}

```


### Variants

To use variants, first define a type for your variants, and pass it as a generic to `makeUseStyles()`. You can then define variant-specific styles within the `variants` key of your style definition.

Then, in the `useStyles()` hook within your component, pass it an object with the current variant values.

```tsx
import { makeUseStyles } from 'react-native-style-kit';

interface ButtonVariants {
    variant: 'outlined' | 'filled';
}

// Note the double parentheses here "()({...})" required for TypeScript to infer the types correctly
const useStyles = makeUseStyles<ButtonVariants>()({
  root: {
    variants: {
      outlined: { ... }, 
      filled: { ... },
    }  
  }
});

const Button = ({ variant = 'filled' }: Partial<ButtonVariants>) => {
  const styles = useStyles({ variant });
    
  return <Pressable style={styles.root}/>
}
```

### Compound variants

You can also define compound variants that apply when multiple variant conditions are met
```tsx
import { makeUseStyles } from 'react-native-style-kit';

interface ButtonVariants {
    variant: 'outlined' | 'filled';
    size: 'sm' | 'md' | 'lg';
}

const useStyles = makeUseStyles<ButtonVariants>()(() => ({
  root: {
    variants: {...},
    compoundVariants: [
      {
        size: 'sm',
        variant: 'outlined',
        style: { ... }
      }
    ]  
  }
}));
```

> Note: Compound variants are applied in the order they are defined, so later definitions will override earlier ones. Compound variants also take precedence over regular variants.

### Runtime values

You can also access runtime values such as screen dimensions or safe area insets within your stylesheets, through the `rt` value passed to the style function

```tsx
import { makeUseStyles } from 'react-native-style-kit';

const useStyles = makeUseStyles(({rt}) => ({
  root: {
    paddingTop: rt.insets.top,
  }
}));

const Button = () => {
  const styles = useStyles();
    
  return <Pressable style={styles.root}/>
}
```

### Performance
`react-native-style-kit` is designed to be as performant as possible without leveraging any compile-time optimisations. Only styles that depend on theme or runtime values subscribe to state updates (although in practice these are not likely to change often). 

Styles are memoized and cached to ensure they are only recalculated when absolutely necessary. Computed styles are also passed to `StyleSheet.create()` to take advantage of the optimisations provided by React Native.
