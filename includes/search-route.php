<?php

function university_register_search()
{
    register_rest_route('university/v1', 'search', array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => function ($data) {
            $mainQuery = new WP_Query(array('post_type' => array('campus', 'professor', 'event', 'post', 'page', 'program'), 's' => sanitize_text_field($data['term'])));
            $results = array(
                'general' => array(),
                'professor' => array(),
                'program' => array(),
                'event' => array(),
                'campus' => array()
            );
            while ($mainQuery->have_posts()) {
                $mainQuery->the_post();
                if (get_post_type() == 'post' or get_post_type() == 'page') {
                    array_push($results['general'], array(
                        'id' => get_the_ID(),
                        'type' => get_post_type(),
                        'authorname' => get_the_author_meta('display_name', get_post_field('post_author')),
                        'title' => get_the_title(),
                        'URL' => get_the_permalink()
                    ));
                } else {
                    if (get_post_type() == 'event') {
                        $eventDate = new DateTime(get_field('event_date'));
                    } else {
                        $eventDate = new DateTime(get_the_date());
                    }

                    if (get_post_type() == 'program') {
                        $related_Campuses = get_field('related_campus');
                        if ($related_Campuses) {
                            foreach ($related_Campuses as $campus) {
                                array_push($results['campus'], array(
                                    'id' => get_the_ID($campus),
                                    'type' => get_post_type($campus),
                                    'title' => get_the_title($campus),
                                    'URL' => get_the_permalink($campus),
                                    'day' => $eventDate->format('d'),
                                    'month' => $eventDate->format('M'),
                                    'excerpt' => wp_trim_words(get_the_excerpt($campus), 18)

                                ));
                            }
                        }
                    }

                    array_push($results[get_post_type()], array(
                        'id' => get_the_ID(),
                        'type' => get_post_type(),
                        'title' => get_the_title(),
                        'URL' => get_the_permalink(),
                        'image' => get_the_post_thumbnail_URL(0, 'professorLandscape'),
                        'day' => $eventDate->format('d'),
                        'month' => $eventDate->format('M'),
                        'excerpt' => wp_trim_words(get_the_excerpt(), 18)

                    ));
                }
            }
            if ($results['program']) {
                $programsMeta = array(
                    'relation' => 'OR'
                );

                foreach ($results['program'] as $item) {
                    array_push($programsMeta, array(
                        'key' => 'related_Programs',
                        'compare' => 'LIKE',
                        'value' => '"' . $item['id'] . '"'

                    ));
                }


                $programRelat = new WP_Query(array(
                    'post_type' => array('professor', 'event'),
                    'meta_query' => $programsMeta
                ));

                while ($programRelat->have_posts()) {
                    $programRelat->the_post();
                    array_push($results[get_post_type()], array(
                        'id' => get_the_ID(),
                        'type' => get_post_type(),
                        'title' => get_the_title(),
                        'URL' => get_the_permalink(),
                        'image' => get_the_post_thumbnail_URL(0, 'professorLandscape'),
                        'day' => $eventDate->format('d'),
                        'month' => $eventDate->format('M'),
                        'excerpt' => wp_trim_words(get_the_excerpt(), 18)



                    ));
                }
                $results['professor'] = array_values(array_unique($results['professor'], SORT_REGULAR));
                $results['event'] = array_values(array_unique($results['event'], SORT_REGULAR));
            }
            return $results;
        }
    ));
}

add_action('rest_api_init', 'university_register_search');
