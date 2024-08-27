/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { webpack }) => {
        config.module.rules.push({
            test: /\.js$/,
            exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
            loader: "babel-loader",
        })

        config.plugins.push(
            new webpack.ProvidePlugin({
                "window.Quill": "quill",
            })
        )

        return config
    },
}

export default nextConfig
