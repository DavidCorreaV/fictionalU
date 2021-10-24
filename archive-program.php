<?php get_header();
pageBanner(array(
    'title' => 'All Programs',
    'subtitle' => "There's something for everyone"
)) ?>


<div class="container container--narrow page-section">
    <?php
    while (have_posts()) {
        the_post();
    ?>
        <ul class="link-list min-list">
            <li><a href="<?php the_permalink(); ?>"><?php the_title() ?></a></li>



        </ul>
    <?php
    }
    echo paginate_links();
    ?>
    <hr class="section-break">
    <p>Looking for past events? <a href="<?php echo site_url('past-events') ?>">Here's the past events archive</a></p>
</div>

<?php get_footer(); ?>
